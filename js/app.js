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