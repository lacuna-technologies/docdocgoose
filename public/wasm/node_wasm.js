// run this file to run pdfcpu.wasm in NodeJS

const fs = require(`fs`)
require(`./wasm_exec.js`)

const wasmBuffer = fs.readFileSync(`./pdfcpu.wasm`)
const go = new Go()
WebAssembly.instantiate(wasmBuffer, go.importObject).then(wasmModule => {
  go.argv = [`pdfcpu.wasm`, ...process.argv.slice(2)]
  go.run(wasmModule.instance)
})

// https://nodejs.dev/learn/nodejs-with-webassembly
// https://dev.to/wcchoi/browser-side-pdf-processing-with-go-and-webassembly-13hn
// https://github.com/golang/go/wiki/WebAssembly#executing-webassembly-with-node-js=
// https://github.com/filerjs/filer/tree/master/src