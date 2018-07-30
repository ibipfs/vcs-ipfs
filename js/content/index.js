function render() {

   // GENERATE PARENT SELECTOR
   var files = `
      <div id="files-outer">
         <div id="files"></div>
      </div>
   `;

   var footer = `
      <div id="footer">Cannot locate IPFS directory</div>
   `;

   // RENDER THEM IN
   $('#content-body').html(files + footer);

   // FETCH EVENTS MODULE
   require('../classes/events.js');

   // FETCH MODULE
   var Sections = require('../classes/sections.js');

   // FILES
   var sections = new Sections();
   sections.files();
}

// EXPORT MODULE
module.exports = render;