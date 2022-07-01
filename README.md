# DocsTogether

A web app for editing your documents (PDF, Microsoft Word DOCX, etc). DocsTogether processes your documents on your computer without your documents ever being uploaded. No need to install any PDF editing software, and your files never leave your computer.

DocsTogether supports the following features:

- [x] Removing security or encryption on documents, including restrictions on editing or highlighting, without requiring the owner password
- [ ] Deleting one or more pages from documents
- [ ] Rotating one mor more pages in documents
- [ ] Merging one or more PDF files
- [x] Optimising and reducing the file size of a PDF file
- [ ] Running optical character recognition (OCR) on a PDF file such that the text in the file becomes selectable and highlightable

## Development

Ensure you have Node.JS installed.

### WebAssembly

DocsTogether uses [pdfcpu](https://github.com/pdfcpu/pdfcpu), a PDF processing library written in Golang. To build an updated WASM module for [pdfcpu](https://github.com/pdfcpu/pdfcpu), ensure Golang is installed, then run `./scripts/build-pdfcpu-wasm.sh`.

To run the WASM module in NodeJS, `cd` into the `public/wasm` folder and run `node node_wasm.js`.

Current `pdfcpu` commit: [11d755a41bcb605c55e2727ab7608a93cb889224](https://github.com/pdfcpu/pdfcpu/commit/11d755a41bcb605c55e2727ab7608a93cb889224)

## Browser Support

DocsTogether aims to support recent versions of Google Chrome, Mozilla Firefox, and Microsoft Edge. Other browsers may be supported as well if the requirements are not conflicting or drastically different. Microsoft Internet Explorer is not supported.