function render() {

   // GENERATE PARENT SELECTORS
   var filter = `
      <div id="filter-outer">
         <div id="filter-inner">
            <input type="text" id="filter" placeholder="Filter by File Name or File Hash" tabindex="1">
         </div>
      </div>
   `;

   var container = '<div id="container"></div>';

   // RENDER THEM IN
   $('#content-body').html(filter + container);

   // FETCH MODULE
   var Sections = require('../classes/sections.js');

   // TRACKER
   var sections = new Sections();
   sections.tracker();

   // FILTER
   $("#filter").on('keyup', () => {
      var query = $('#filter').val();

      // RENDER FILTERED LIST
      sections.tracker(query);
   });
}

// EXPORT RENDER FUNCTION AS MODULE
module.exports = render;