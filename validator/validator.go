package validator

import (
	"reflect"

	"github.com/dop251/goja"
	js_ast "github.com/dop251/goja/ast"
	"github.com/pkg/errors"
)

var ErrLoopDetected = errors.New("loop detected")
var ErrArrowFunctionNotAllowed = errors.New("arrow function not allowed in this context")
var ErrFunctionNotAllowed = errors.New("function not allowed")
var ErrRegExpNotAllowed = errors.New("regular expression not allowed")
var ErrSpreadNotAllowed = errors.New("spread operator not allowed")

type validator struct {
	ast *js_ast.Program
}

type scanContext interface {
	ExitScope()
}

type dummyScanContext struct{}

func (d dummyScanContext) ExitScope() {}

func (v *validator) scan(current reflect.Value, context scanContext, callback func(reflect.Value, scanContext) scanContext) {
	innerCtx := callback(current, context)
	if innerCtx != nil {
		defer innerCtx.ExitScope()
	}

	switch current.Kind() {
	case reflect.Ptr:
		if current.IsNil() {
			return
		}
		v.scan(current.Elem(), innerCtx, callback)
	case reflect.Struct:
		for i := 0; i < current.NumField(); i++ {
			v.scan(current.Field(i), innerCtx, callback)
		}
	case reflect.Array, reflect.Slice:
		for i := 0; i < current.Len(); i++ {
			v.scan(current.Index(i), innerCtx, callback)
		}
	case reflect.Map:
		for _, key := range current.MapKeys() {
			v.scan(current.MapIndex(key), innerCtx, callback)
		}
	case reflect.Interface:
		if current.IsNil() {
			return
		}
		v.scan(current.Elem(), innerCtx, callback)
	default:
	}
}

func (v *validator) scanFromRootTyped(ty []reflect.Type, context scanContext, callback func(interface{}, scanContext) scanContext, callbackOtherwise func(reflect.Value, scanContext) scanContext) {
	v.scan(reflect.ValueOf(v.ast), context, func(v reflect.Value, i scanContext) scanContext {
		for _, t := range ty {
			if v.Type() == t {
				return callback(v.Interface(), i)
			}
		}

		if callbackOtherwise != nil {
			return callbackOtherwise(v, i)
		}
		return i
	})
}

func (v *validator) assertNoLoops() {
	v.scanFromRootTyped([]reflect.Type{
		reflect.TypeOf(js_ast.ForStatement{}),
		reflect.TypeOf(js_ast.ForInStatement{}),
		reflect.TypeOf(js_ast.ForOfStatement{}),
		reflect.TypeOf(js_ast.WhileStatement{}),
		reflect.TypeOf(js_ast.DoWhileStatement{}),
	}, nil, func(v interface{}, i scanContext) scanContext {
		panic(ErrLoopDetected)
	}, nil)
}

type assertTrivialFunctions_ctx struct {
	dummyScanContext
	isMapFilterReduceFind bool
}

func (v *validator) assertTrivialFunctions() {
	v.scanFromRootTyped([]reflect.Type{
		reflect.TypeOf(&js_ast.ArrowFunctionLiteral{}),
	}, assertTrivialFunctions_ctx{}, func(v interface{}, _sc scanContext) scanContext {
		sc := _sc.(assertTrivialFunctions_ctx)
		if !sc.isMapFilterReduceFind {
			panic(ErrArrowFunctionNotAllowed)
		} else {
			sc.isMapFilterReduceFind = false
			return sc
		}
	}, func(current reflect.Value, _sc scanContext) scanContext {
		sc := _sc.(assertTrivialFunctions_ctx)

		if current.Type() == reflect.TypeOf(js_ast.CallExpression{}) {
			call := current.Interface().(js_ast.CallExpression)
			callee := call.Callee
			if exp, ok := callee.(*js_ast.DotExpression); ok {
				if exp.Identifier.Name == "map" || exp.Identifier.Name == "filter" || exp.Identifier.Name == "reduce" || exp.Identifier.Name == "find" || exp.Identifier.Name == "findIndex" || exp.Identifier.Name == "forEach" {
					if len(call.ArgumentList) == 1 {
						sc.isMapFilterReduceFind = true
						return sc
					}
				}
			}
		}

		switch current.Kind() {
		case reflect.Slice: // inherit
		case reflect.Interface:
		default:
			sc.isMapFilterReduceFind = false
		}

		return sc
	})

	v.scanFromRootTyped([]reflect.Type{
		reflect.TypeOf(&js_ast.FunctionLiteral{}),
	}, nil, func(v interface{}, _sc scanContext) scanContext {
		panic(ErrFunctionNotAllowed)
	}, nil)
}

// The global `RegExp` object is not checked.
func (v *validator) assertNoRegExp() {
	v.scanFromRootTyped([]reflect.Type{
		reflect.TypeOf(js_ast.RegExpLiteral{}),
	}, nil, func(v interface{}, _sc scanContext) scanContext {
		panic(ErrRegExpNotAllowed)
	}, nil)
}

func (v *validator) assertNoSpread() {
	v.scanFromRootTyped([]reflect.Type{
		reflect.TypeOf(js_ast.SpreadElement{}),
	}, nil, func(v interface{}, _sc scanContext) scanContext {
		panic(ErrSpreadNotAllowed)
	}, nil)
}

func (v *validator) runValidation() (retErr error) {
	defer func() {
		if err := recover(); err != nil {
			retErr = err.(error)
		}
	}()
	v.assertNoLoops()
	v.assertTrivialFunctions()
	v.assertNoRegExp()
	v.assertNoSpread()
	return nil
}

func ValidateAndCompileScript(script string) (*goja.Program, error) {
	ast, err := goja.Parse("<stdin>", script)
	if err != nil {
		return nil, err
	}

	v := &validator{ast}
	if err := v.runValidation(); err != nil {
		return nil, err
	}

	return goja.CompileAST(ast, false)
}
