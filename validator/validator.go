package validator

import (
	"reflect"

	"github.com/dop251/goja"
	js_ast "github.com/dop251/goja/ast"
	"github.com/dop251/goja/parser"
	"github.com/dop251/goja/token"
	"github.com/pkg/errors"
)

var ErrLoopDetected = errors.New("loop detected")
var ErrArrowFunctionNotAllowed = errors.New("arrow function not allowed in this context")
var ErrFunctionNotAllowed = errors.New("function not allowed")
var ErrRegExpNotAllowed = errors.New("regular expression not allowed")
var ErrSpreadNotAllowed = errors.New("spread operator not allowed")
var ErrAssignmentNotAllowed = errors.New("assignment not allowed")
var ErrObjectLiteralKeyNotAllowed = errors.New("object literal key not allowed")
var ErrScriptTooLong = errors.New("script too long")
var ErrPlusNotAllowed = errors.New("plus operator not allowed")

var propFuncCallbackAllowlist = map[string]struct{}{
	"map":       {},
	"filter":    {},
	"reduce":    {},
	"find":      {},
	"findIndex": {},
	"forEach":   {},
}

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
				if _, ok := propFuncCallbackAllowlist[exp.Identifier.Name.String()]; ok {
					sc.isMapFilterReduceFind = true
					return sc
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

func (v *validator) assertTrivialAssignments() {
	v.scanFromRootTyped([]reflect.Type{
		reflect.TypeOf(js_ast.AssignExpression{}),
	}, nil, func(v interface{}, _sc scanContext) scanContext {
		exp := v.(js_ast.AssignExpression)
		if id, ok := exp.Left.(*js_ast.Identifier); ok {
			if id.Name == "output" {
				return _sc
			}
		}
		panic(ErrAssignmentNotAllowed)
	}, nil)
}

func (v *validator) assertObjectLiteralKeys() {
	v.scanFromRootTyped([]reflect.Type{
		reflect.TypeOf(js_ast.ObjectLiteral{}),
	}, nil, func(v interface{}, _sc scanContext) scanContext {
		exp := v.(js_ast.ObjectLiteral)
		for _, prop := range exp.Value {
			if keyed, ok := prop.(*js_ast.PropertyShort); ok {
				if _, ok := propFuncCallbackAllowlist[keyed.Name.Name.String()]; !ok {
					continue
				}
			}

			if prop, ok := prop.(*js_ast.PropertyKeyed); ok && !prop.Computed {
				if prop.Kind == js_ast.PropertyKindValue {
					if id, ok := prop.Key.(*js_ast.StringLiteral); ok {
						if _, ok := propFuncCallbackAllowlist[id.Literal]; !ok {
							continue
						}
					}
				}
			}

			panic(ErrObjectLiteralKeyNotAllowed)
		}
		return _sc
	}, nil)
}

func (v *validator) assertTrivialBinExpr() {
	v.scanFromRootTyped([]reflect.Type{
		reflect.TypeOf(js_ast.BinaryExpression{}),
	}, nil, func(v interface{}, _sc scanContext) scanContext {
		exp := v.(js_ast.BinaryExpression)
		switch exp.Operator {
		case token.PLUS:
			panic(ErrPlusNotAllowed)
		}
		return _sc
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
	v.assertTrivialAssignments()
	v.assertObjectLiteralKeys()
	v.assertTrivialBinExpr()
	return nil
}

func ValidateAndCompileScript(script string) (*goja.Program, error) {
	if len(script) > MaxScriptSize {
		return nil, ErrScriptTooLong
	}
	ast, err := goja.Parse("<stdin>", script, parser.WithDisableSourceMaps)
	if err != nil {
		return nil, err
	}

	v := &validator{ast}
	if err := v.runValidation(); err != nil {
		return nil, err
	}

	body := &js_ast.BlockStatement{
		List: ast.Body,
	}
	ast.Body = []js_ast.Statement{body}

	return goja.CompileAST(ast, false)
}

func PatchVM(vm *goja.Runtime) {
	_, err := vm.RunString(`
{
	// https://github.com/dop251/goja/pull/342
	(() => {
    const thrower = () => {
			throw new TypeError("dynamic code evaluation is disabled");
    }
    globalThis.eval = () => thrower();
    Object.defineProperty(globalThis.eval, "name", {
			value: "eval",
    })
    for (const f of ["Function", "GeneratorFunction", "AsyncFunction"]) {
			if (f in globalThis) {
				const stub = function() {
						thrower();
				}
				stub.prototype = globalThis[f].prototype; // so that things like '(()=>{}) instanceof Function' work as expected
				globalThis[f].prototype.constructor = stub;
				globalThis[f] = stub;
			}
    }
	})();
	delete RegExp;
	delete Proxy;
	delete globalThis;
	delete Promise;
	delete WeakSet;
	delete WeakMap;
	delete Map;
	delete Set;
	delete DataView;
	const arrayProps = {
		"length": true,
		"map":       true,
		"filter":    true,
		"reduce":    true,
		"find":      true,
		"findIndex": true,
		"forEach":   true,
	};
	for(const name of Object.getOwnPropertyNames(Array.prototype)) {
		if(!arrayProps[name]) {
			delete Array.prototype[name];
		}
	}
	let clearProps = (name) => {
		let x = this[name];
		for(const k of Object.getOwnPropertyNames(x.prototype.__proto__)) {
			delete x.prototype.__proto__[k];
		}
		for(const k of Object.getOwnPropertyNames(x.prototype)) {
			delete x.prototype[k];
		}
		delete this[name];
	}
	clearProps("Int8Array");
	clearProps("Uint8Array");
	clearProps("Uint8ClampedArray");
	clearProps("Int16Array");
	clearProps("Uint16Array");
	clearProps("Int32Array");
	clearProps("Uint32Array");
	clearProps("Float32Array");
	clearProps("Float64Array");

	clearProps = (name) => {
		let x = this[name];
		for(const k of Object.getOwnPropertyNames(x.prototype)) {
			delete x.prototype[k];
		}
		delete this[name];
	}
	clearProps("ArrayBuffer");
	clearProps("String");

	Object.getOwnPropertyNames(Array).forEach(x => delete Array[x]);
	Object.getOwnPropertyNames(Object).forEach(x => delete Object[x]);
}
	`)
	if err != nil {
		panic(err)
	}
}
