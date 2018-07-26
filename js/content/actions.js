function render() {

   var stuff = `
      <div id="files-outer">
         <div id="activity"></div>
      </div>
   `;

   // RENDER THEM IN
   $('#content-body').html(stuff);

   // FETCH ACTIONS MODULE
   var Actions = require('../classes/actions.js');
   var actions = new Actions();

   actions.release();
}

// EXPORT MODULE
module.exports = render;