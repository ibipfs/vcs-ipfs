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

   // FETCH MOMENT MODULE
   var moment = require('moment');

   // FETCH & INSTANCIATE MUTABLE MODULE
   var Mutable = require('../classes/mutable.js');
   var mutable = new Mutable();

   // FETCH HASH OF LATEST RELEASE
   mutable.read('history.json').then((history) => {
      
      // PARSE HISTORY
      history = JSON.parse(history);

      // RENDER CONTENT
      var files = new Files(history.current.hash, history.current.name, moment.unix(history.current.timestamp).format('D/MM @ HH:mm'));
      files.body();
      files.footer();
   });
}

// EXPORT MODULE
module.exports = render;