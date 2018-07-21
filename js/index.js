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

   // FETCH EVENTS MODULE
   require('./classes/events.js');

   // RENDER THEM IN
   $('#content-body').html(files + footer);

   // RENDER CONTENT
   var files = new Files(root);
   files.body();
   files.footer();
}

// EXPORT MODULE
module.exports = render;