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

   // RENDER IT IN
   $('#content-body').html(files + footer);

   // RENDER CONTENT
   var render = new Render(root);
   render.body();
   render.footer();
}

// EXPORT MODULE
module.exports = render;