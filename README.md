## Description
This application allows you to edit, publish and keep track of older versions of files that are located in a IPFS directory. DHT functionality hasn't yet been implemented in the javascript IPFS framework, so a localized but protected gateway method is used. All original and published edits of files are stored on the immutable side of IPFS while the logsystem that keeps track of everything administrative is on the mutable side.

Everything can and many values should be modified to fit your environment which is why this repository doesn't contain any pre-compiled files or directories.

## Requires Compiling

   Browserify:
   > js/app.js > js/bundle.js

   Smart Contracts:
   > [contracts/](contracts/)*


   > [migrations/](migrations/)*

## Development Tools

   Smart Contract compiling/deployment:
   > [Truffle](https://github.com/trufflesuite)

   Local Blockchain:
   > [Ganache CLI](https://github.com/trufflesuite/ganache-cli) @ localhost:8485

   IPFS Gateway:
   > [JS-IPFS-API](https://github.com/ipfs/js-ipfs-api) @ localhost:5001

## NPM Modules

   Code editor:
   > [Monaco Editor (ported) by Tim Kendrick](https://github.com/timkendrick/monaco-editor)

   String to Binary converter:
   > [Buffer](https://www.npmjs.com/package/buffer)

   Unix timestamp to DateTime converter:
   > [Moment](https://www.npmjs.com/package/moment)

## Change Settings

   Host address for IPFS/Blockchain:
   > [js/setup.js @ row #2](js/setup.js)

   Smart Contract deployment network:
   > [truffle.js](truffle.js)