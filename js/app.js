//old QmaYEbgsnsGdWG9oPBrM6L3ZqVpCLJMUBHQL4ds424QHu9 
var validCID = 'QmaQSy8hzDRJRBrc37sAcX17AGTjwti9KTem4KvKXpL6YP';
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