# DocsTogether

A web app for editing your documents (PDF, Microsoft Word DOCX, etc). DocsTogether processes your documents on your computer without your documents ever being uploaded. No need to install any PDF editing software, and your files never leave your computer.

## Development

Ensure you have Node.JS installed.

### WebAssembly

DocsTogether uses [pdfcpu](https://github.com/pdfcpu/pdfcpu), a PDF processing library written in Golang. To build an updated WASM module for [pdfcpu](https://github.com/pdfcpu/pdfcpu), ensure Golang is installed, then run `./scripts/build-pdfcpu-wasm.sh`.

To run the WASM module in NodeJS, `cd` into the `public/wasm` folder and run `node node_wasm.js`.

Current `pdfcpu` commit: [b9818b8a01eaaa742ef42cb9982fa4661445453e](https://github.com/pdfcpu/pdfcpu/commit/b9818b8a01eaaa742ef42cb9982fa4661445453e)

## Browser Support

DocsTogether aims to support recent versions of Google Chrome, Mozilla Firefox, and Microsoft Edge. Other browsers may be supported as well if the requirements are not conflicting or drastically different. Microsoft Internet Explorer is not supported.