// DECLARE CURRENT VAR FOR MAINMENU UNDERLINING
var current = 'files';

// WHEN DOCUMENT LOADS
$(document).ready(() => {
   var config = require('./config.js')();

   // REFRESH CONFIG
   config.then((config) => {

      // RENDER IN LOGIC
      require('./sections/index.js').render(config);

      // FETCH ALL EVENTS
      require('./modules/events.js')(config);

      // IF USER IS MASTER, ADD MANAGE LINK TO MAINMENU
      if (config.metamask.permission == 'master') { $('ul').append('<li><a href="javascript:void(0)">Manage</a></li>'); }
   });
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
            section_module = require('./sections/activity.js');
            current = 'activity';
         break;

         // TRACKER
         case 'tracker':
            section_module = require('./sections/tracker.js');
            current = 'tracker';
         break;

         // TRACKER
         case 'manage':
            section_module = require('./sections/manage.js');
            current = 'manage';
         break;
   
         // FALLBACK & INDEX
         default:
            section_module = require('./sections/index.js');
            current = 'files';
         break;
      }

      // FETCH CONFIG & WAIT FOR IT TO RESOLVE, THEN EXECUTE ITS RENDER MODULE
      var config = require('./config.js')();
      config.then((config) => { section_module.render(config); });
   }
});