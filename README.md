<p align="center">
  <img src="./public/assets/docdocgoose-logo.png" width="250" />
</p>
<h1 align="center">
  DocDocGoose
</h1>

A web app for editing your documents (`.pdf`, `.docx`, etc). DocDocGoose processes your documents on your computer without your documents ever being uploaded. No need to install any PDF editing software, and your files never leave your computer.

## Development

### Setup

Ensure you have Node.JS installed, then install the `npm` dependencies.

```shell
npm i

```

### WebAssembly

DocDocGoose uses [pdfcpu](https://github.com/pdfcpu/pdfcpu), a PDF processing library written in Golang. To build an updated WASM module for [pdfcpu](https://github.com/pdfcpu/pdfcpu), ensure Golang is installed, then run `./scripts/build-pdfcpu-wasm.sh`.

To run the WASM module in NodeJS, `cd` into the `public/wasm` folder and run `node node_wasm.js`.

Current `pdfcpu` commit: [07d9762](https://github.com/pdfcpu/pdfcpu/commit/07d97625e3fa00f05a6f7559a53463574329931a)

### Running in development

```shell
npm run dev
```

## Production

```shell
npm run build
netlify deploy --prod
```

## Browser Support

DocDocGoose aims to support recent versions of Google Chrome, Mozilla Firefox, and Microsoft Edge. Other browsers may be supported as well if the requirements are not conflicting or drastically different. Microsoft Internet Explorer is not supported.