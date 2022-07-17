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

Current `pdfcpu` commit: [b9818b8a01eaaa742ef42cb9982fa4661445453e](https://github.com/pdfcpu/pdfcpu/commit/b9818b8a01eaaa742ef42cb9982fa4661445453e)

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