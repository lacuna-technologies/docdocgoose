# DocsTogether

A web app for editing your documents (PDF, Microsoft Word DOCX, etc). DocsTogether processes your documents on your computer without your documents ever being uploaded. No need to install any PDF editing software, and your files never leave your computer.

DocsTogether supports the following features:

- [ ] Removing security or encryption on documents, including restrictions on editing or highlighting, without requiring the owner password
- [ ] Deleting one or more pages from documents
- [ ] Rotating one mor more pages in documents
- [ ] Merging one or more PDF files
- [ ] Optimising and reducing the file size of a PDF file
- [ ] Running optical character recognition (OCR) on a PDF file such that the text in the file becomes selectable and highlightable

## Development

Ensure you have Node.JS installed.

### WASM

DocsTogether uses [pdfcpu](https://github.com/pdfcpu/pdfcpu), a PDF processing library written in Golang. To build an updated WASM module for [pdfcpu](https://github.com/pdfcpu/pdfcpu) install Golang and run `node ./scripts/build-pdfcpu-wasm.js`.

