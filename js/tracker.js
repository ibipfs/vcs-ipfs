function render() {

   // GENERATE PARENT SELECTORS
   var filter = `
      <div id="filter-outer">
         <div id="filter-inner">
            <input type="text" id="filter" placeholder="Filter by File Hash" tabindex="1">
         </div>
      </div>
   `;

   var container = `
      <div id="container"></div>
   `;

   // RENDER THEM IN
   $('#content-body').html(filter + container);

   // FETCH MODULE
   var Tracker = require('./classes/tracker.js');

   // TRACKER
   var tracker = new Tracker();
   tracker.body();

   // FILTER
   $("#filter").on('keyup', function() {
      var query = $('#filter').val();

      // RENDER FILTERED LIST
      tracker.body(query);
   });
}

// EXPORT CLASS
module.exports = render;