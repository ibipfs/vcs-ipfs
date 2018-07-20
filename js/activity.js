function render() {

   // GENERATE PARENT SELECTORS
   var filter = `
      <div id="filter-outer">
         <div id="filter-inner">
            <input type="text" id="filter" placeholder="Filter by Username or File Hash" tabindex="1">
         </div>
      </div>
   `;

   var files = `
      <div id="files-outer">
         <div id="activity"></div>
      </div>
   `;

   // RENDER THEM IN
   $('#content-body').html(filter + files);

   // FETCH MODULE
   var Activities = require('./classes/activities.js');

   // ACTIVITIES
   var activities = new Activities();
   activities.body();

   // FILTER
   $("#filter").on('keyup', function() {
      var query = $('#filter').val();

      // RENDER FILTERED LIST
      activities.body(query);
   });

}

// EXPORT CLASS
module.exports = render;