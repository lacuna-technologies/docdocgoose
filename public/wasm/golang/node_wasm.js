// run this file to run pdfcpu.wasm in NodeJS

const fs = require(`fs`)
require(`./wasm_exec.js`)

const wasmBuffer = fs.readFileSync(`./pdfcpu.wasm`)
const go = new Go()
WebAssembly.instantiate(wasmBuffer, go.importObject).then(wasmModule => {
  go.argv = [`pdfcpu.wasm`, ...process.argv.slice(2)]
  go.run(wasmModule.instance)
})
