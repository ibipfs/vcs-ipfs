var Tracker = require('./classes/tracker.js');

// METAMASK CHECK
var metamask = new Metamask();
metamask.check();

// ACTIVITIES
var tracker = new Tracker();
tracker.body();

// FILTER
$("#filter").on('keyup', function() {
   var query = $('#filter').val();

   // RENDER FILTERED LIST
   tracker.body(query);
});