package validator

import (
	"testing"

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

func TestRealWorld(t *testing.T) {
	_, err := ValidateAndCompileScript("output = createReplicaTransaction().PrefixList(base64Decode(data.prefix), data.limit, data.after).Collect().map(([k, v]) => [base64Encode(k), base64Encode(v)])")
	assert.Nil(t, err)
}
