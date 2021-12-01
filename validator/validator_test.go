package validator

import (
	"testing"

	"github.com/dop251/goja"
	"github.com/stretchr/testify/assert"
)

func TestRejectLoops(t *testing.T) {
	_, err := ValidateAndCompileScript("if(1) {} else {}")
	assert.Nil(t, err)

	_, err = ValidateAndCompileScript("while(1) { }")
	assert.Equal(t, ErrLoopDetected, err)

	_, err = ValidateAndCompileScript("for(;;) { }")
	assert.Equal(t, ErrLoopDetected, err)

	_, err = ValidateAndCompileScript("for(const x of v) { }")
	assert.Equal(t, ErrLoopDetected, err)

	_, err = ValidateAndCompileScript("for(const x in v) { }")
	assert.Equal(t, ErrLoopDetected, err)

	_, err = ValidateAndCompileScript("do { } while(1)")
	assert.Equal(t, ErrLoopDetected, err)
}

func TestRejectFreeFunctions(t *testing.T) {
	_, err := ValidateAndCompileScript("function f() {}")
	assert.Equal(t, ErrFunctionNotAllowed, err)
	_, err = ValidateAndCompileScript("let func = function() {}")
	assert.Equal(t, ErrFunctionNotAllowed, err)
	_, err = ValidateAndCompileScript("let func = () => {}")
	assert.Equal(t, ErrArrowFunctionNotAllowed, err)
	_, err = ValidateAndCompileScript("arr.map(x => {})")
	assert.Nil(t, err)
	_, err = ValidateAndCompileScript("arr.mapx(x => {})")
	assert.Equal(t, ErrArrowFunctionNotAllowed, err)
	_, err = ValidateAndCompileScript("arr.map(x => () => 1)")
	assert.Equal(t, ErrArrowFunctionNotAllowed, err)
}

func TestRejectRegExp(t *testing.T) {
	_, err := ValidateAndCompileScript("let a = /a/;")
	assert.Equal(t, ErrRegExpNotAllowed, err)
}

func TestRejectSpread(t *testing.T) {
	_, err := ValidateAndCompileScript("let a = [1, 2, ...[3, 4]];")
	assert.Equal(t, ErrSpreadNotAllowed, err)
}

func TestRejectBadAssignment(t *testing.T) {
	_, err := ValidateAndCompileScript("let xxx = 1")
	assert.Nil(t, err)
	_, err = ValidateAndCompileScript("const xxx = 1")
	assert.Nil(t, err)
	_, err = ValidateAndCompileScript("var xxx = 1")
	assert.Nil(t, err)

	_, err = ValidateAndCompileScript("xxx = 1")
	assert.Equal(t, ErrAssignmentNotAllowed, err)
}

func TestRejectMalicious(t *testing.T) {
	_, err := ValidateAndCompileScript("let arr = []; arr.push(() => arr[0]()); arr[0]();")
	assert.Equal(t, ErrArrowFunctionNotAllowed, err)

	_, err = ValidateAndCompileScript("let arr = []; arr.map = arr.push; arr.map(() => arr[0]()); arr[0]();")
	assert.Equal(t, ErrAssignmentNotAllowed, err)

	_, err = ValidateAndCompileScript("Array.prototype.map = Array.prototype.push; let arr = []; arr.map(() => arr[0]()); arr[0]();")
	assert.Equal(t, ErrAssignmentNotAllowed, err)

	_, err = ValidateAndCompileScript("let arr = []; let o = { map: arr.push.bind(arr) }; o.map(() => arr[0]()); arr[0]();")
	assert.Equal(t, ErrObjectLiteralKeyNotAllowed, err)
}

func TestRealWorld(t *testing.T) {
	_, err := ValidateAndCompileScript("output = createReplicaTransaction().PrefixList(base64Decode(data.prefix), data.limit, data.after).Collect().map(([k, v]) => [base64Encode(k), base64Encode(v)])")
	assert.Nil(t, err)
}

func TestBinExpr(t *testing.T) {
	_, err := ValidateAndCompileScript("1 - 1")
	assert.Nil(t, err)

	_, err = ValidateAndCompileScript("1 - (-1)")
	assert.Nil(t, err)

	_, err = ValidateAndCompileScript("1 + 1")
	assert.Equal(t, ErrPlusNotAllowed, err)

	_, err = ValidateAndCompileScript("a += 1")
	assert.Equal(t, ErrAssignmentNotAllowed, err)

	_, err = ValidateAndCompileScript("a -= 1")
	assert.Equal(t, ErrAssignmentNotAllowed, err)
}

func TestPatchVM(t *testing.T) {
	vm := goja.New()
	PatchVM(vm)

	_, err := vm.RunString("eval('1 + 1')")
	assert.EqualError(t, err, "TypeError: Dynamic code execution is disabled at <eval>:1:5(2)")

	_, err = vm.RunString("new Function('1 + 1')")
	assert.EqualError(t, err, "TypeError: Dynamic code execution is disabled at <eval>:1:14(2)")
}
