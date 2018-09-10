## Borrowed Tools/Functionality
- [GO-IPFS](https://github.com/ipfs/go-ipfs)
- [JS-IPFS-API](https://github.com/ipfs/js-ipfs-api)
- [Truffle](https://github.com/trufflesuite/truffle)
- [Ganache](https://github.com/trufflesuite/ganache-cli)
- [jQuery](https://jquery.com/)

- [NodeJS & NPM](https://nodejs.org/en/)
- [Backported Monaco Editor by Tim Kendrick](https://github.com/timkendrick/vscode-monaco-editor)
- [Buffer](https://www.npmjs.com/package/buffer)
- [Browserify](https://www.npmjs.com/package/browserify)
- [Moment](https://www.npmjs.com/package/moment)

## Turn on necessary components & compile

Turn on IPFS Daemon:
> $ shell/daemon.sh

Push temp dataset to IPFS Swarm:
> $ shell/dataset.sh

Fix "CORS" error:
> [https://github.com/ipfs/js-ipfs-api#cors](https://github.com/ipfs/js-ipfs-api#cors)

Turn on Local Blockchain:
> $ shell/ganache.sh

Compile/Deploy Smart Contracts:
> $ shell/deploy.sh

Compile project node modules:
> $ shell/browserify.sh

## Change default values

Blockchain & IPFS address/port:
> [js/setup.js @ row 2-4](https://github.com/wickstjo/ipfs/blob/master/js/setup.js#L2)

Root IPFS directory:
> [js/modules/mutable.js @ row 70](https://github.com/wickstjo/ipfs/blob/master/js/modules/mutable.js#L70)