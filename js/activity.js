var Activities = require('./classes/activities.js');

// METAMASK CHECK
var metamask = new Metamask();
metamask.check();

// ACTIVITIES
var activities = new Activities();
activities.body();

// FILTER
$("#filter").on('keyup', function() {
   var query = $('#filter').val();

   // RENDER FILTERED LIST
   activities.body(query);
});