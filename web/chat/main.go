package main

import (
	"syscall/js"
)

func hi(this js.Value, args []js.Value) interface{} {
	return "Hello, world 2!"
}

func main() {
	js.Global().Set("hi", js.FuncOf(hi))

	select {}
}
