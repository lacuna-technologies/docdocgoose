<p align="center">
  <img src="./public/assets/docdocgoose-logo.png" width="250" />
</p>
<h1 align="center">
  DocDocGoose
</h1>

A web app for editing your documents (`.pdf`, `.docx`, etc). DocDocGoose processes your documents on your computer without your documents ever being uploaded. No need to install any PDF editing software, and your files never leave your computer.

It can also generate bookmarks for certain PDF documents automatically using [pdf_scout](https://github.com/hueyy/pdf_scout). Check [this list of supported document types](https://github.com/hueyy/pdf_scout#supported-document-types). Bookmark generation is rather slow at the moment, and will likely take several minuts or more, partly because Python is not a fast language and partly because there is a lot of room for optimisation. But it works.

## Development

### Setup

Ensure you have Node.JS installed, then install the `npm` dependencies.

```shell
npm i

```

### WebAssembly

#### pdfcpu

DocDocGoose uses [pdfcpu](https://github.com/pdfcpu/pdfcpu), a PDF processing library written in Golang. To build an updated WASM module for [pdfcpu](https://github.com/pdfcpu/pdfcpu), ensure Golang is installed, then run `./scripts/build-pdfcpu-wasm.sh`.

To run the WASM module in NodeJS, `cd` into the `public/wasm/golang` folder and run `node node_wasm.js`.

Current `pdfcpu` commit: [07d9762](https://github.com/pdfcpu/pdfcpu/commit/07d97625e3fa00f05a6f7559a53463574329931a)

#### pdf_scout

DocDocGoose uses [pdf_scout](https://github.com/hueyy/pdf_scout), a Python CLI tool. To set this up, you must install download the [latest Pyodide release](https://github.com/pyodide/pyodide/releases) (e.g. [0.21.3](https://github.com/pyodide/pyodide/releases/download/0.21.3/pyodide-build-0.21.3.tar.bz2)), and extract the pyodide folder to `/public/wasm/pyodide`.

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