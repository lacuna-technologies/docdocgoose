#!/bin/bash
# builds new WASM file for pdfcpu
# assumes git and golang are installed

read -p "Enter the pdfcpu tag number to clone [v0.3.13]: " tagName
tagName=${tagName:-v0.3.13}

cd "$(dirname "$0")"

rm -Rf pdfcpu
git clone --depth 1 --branch $tagName https://github.com/hhrutter/pdfcpu
cd pdfcpu/cmd/pdfcpu
GOOS=js GOARCH=wasm go build -o pdfcpu.wasm
mv pdfcpu.wasm ../../../../app/wasm/
rm -Rf pdfcpu

cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" ../app/wasm