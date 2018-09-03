function render() {

   // GENERATE PARENT SELECTORS
   var filter = `
      <div id="filter-outer">
         <div id="filter-inner">
            <input type="text" id="filter" placeholder="Filter by Username, File Name or File Hash" tabindex="1">
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
   var Sections = require('../classes/sections.js');

   // ACTIVITIES
   var sections = new Sections();
   sections.activities();

   // FILTER
   $("#filter").on('keyup', () => {
      var query = $('#filter').val();

      // RENDER FILTERED LIST
      sections.activities(query);
   });

}

function foobar() {
   log('eyylmao');
}

// EXPORT RENDER FUNCTION AS MODULE
module.exports = render;