// APP.JS

   $('body').on('click', '#menu a', () => {
      var value = $(target).text();

      switch (value) {
      
         case 'activity':
            section_module = require('./sections/activity.js');
            current = 'activity';
         break;

         default:
            section_module = require('./sections/index.js');
            current = 'files';
         break;
      }

      section_module();
   });

// SECTIONS/ACTIVITY.JS

   function render() {
      body();
      events();
   }

   function body() {
      var files = `
         <div id="files">
            <a href="#" id="trigger">Click Me!</a>
         </div>
      `;

      // CONTAINER SELECTOR EXISTS @INDEX.HTML
      $('#container').html(files);
   }

   function events() {
      $('body').on('click', '#trigger', () => {
         console.log('foo');
      });
   }

   module.exports = render;