// DECLARE CURRENT VAR FOR MAINMENU UNDERLINING
var current = 'files';

// RENDER IN INDEX WHEN PAGE IS FIRST LOADED
$(document).ready(() => {
   require('./content/index.js')();
});

// WHEN MENULINK IS CLICKED
$('body').on('click', '#menu a', () => {

   // CLICKED MENU ELEMENT VALUE
   var value = $(event.target).text();
   value = value.toLowerCase();

   if (current != value) {

      // REMOVE UNDERLINE FROM EVERY ELEMENT
      $('#menu a').css('text-decoration', 'none');

      // UNDERLINE TARGET
      $(event.target).css('text-decoration', 'underline');

      // PLACEHOLDER MODULE
      var section_module;
   
      switch (value) {
   
         // ACTIVITY
         case 'activity':
            section_module = require('./content/activity.js');
            current = 'activity';
         break;

         // TRACKER
         case 'tracker':
            section_module = require('./content/tracker.js');
            current = 'tracker';
         break;

         // TRACKER
         case 'manage':
            section_module = require('./content/manage.js');
            current = 'manage';
         break;
   
         // FALLBACK & INDEX
         default:
            section_module = require('./content/index.js');
            current = 'files';
         break;
      }

      section_module();
   }
});