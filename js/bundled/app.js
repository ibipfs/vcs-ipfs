(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// old = QmUfiUfPtE8Yv6tim9bFSanQrZMJR7NgH4ACgeU2zbQwJE
var validCID = 'QmaYEbgsnsGdWG9oPBrM6L3ZqVpCLJMUBHQL4ds424QHu9';
var render = new Render(validCID);

render.body();
render.footer();

// REQUIRE IN FOR MUTABLE IPFS METHODS
//var Mutable = require('./classes/mutable.js');

// var mutable = new Mutable();

// mutable.list();
// mutable.check();

// mutable.write('asdf.js', 'asdasd').then(() => {
//    mutable.flush();
//    mutable.list();
// });
},{}]},{},[1]);
