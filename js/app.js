var config = require('./config.js')();
config.then((config) => {
   
   // FORMAT METAMASK BLOCK
   var text;
   var bg;
   var border;

   // CHECK FOR SESSION
   if (config.metamask.session == true) {

      // CHECK WHITELIST
      if (config.metamask.name != null) {

         text = 'MetaMask Connected - ' + config.metamask.name;
         bg = 'success';
         border = '#B5D0C6';

      } else {

         text = 'MetaMask Found - Unknown User';
         bg = 'caution';
         border = '#dada8b';

      }

   } else {

      text = 'MetaMask Session Not Found';
      bg = 'error';
      border = '#CCAAAA';
   }

   // FINALLY RENDER APPROPRIATELY
   $('#metamask').text(text);
   $('#metamask').css('background', "url('interface/img/" + bg + ".png')");
   $('#metamask').css('border', 'thin solid' + border);
});

// RENDER IN INDEX WHEN PAGE IS FIRST LOADED
require('./content/index.js')();
var current = 'files';

// WHEN MENULINK IS CLICKED
$('body').on('click', '#menu a', () => {

   // CLICKED MENU ELEMENT VALUE
   var val = $(event.target).text();
   val = val.toLowerCase();

   if (current != val) {

      // REMOVE UNDERLINE FROM EVERY ELEMENT
      $('#menu a').css('text-decoration', 'none');

      // UNDERLINE TARGET
      $(event.target).css('text-decoration', 'underline');

      // PLACEHOLDER MODULE
      var sectionModule;
   
      switch (val) {
   
         // ACTIVITY
         case 'activity':
            sectionModule = require('./content/activity.js');
            current = 'activity';
         break;

         // TRACKER
         case 'tracker':
            sectionModule = require('./content/tracker.js');
            current = 'tracker';
         break;

         // TRACKER
         case 'actions':
            sectionModule = require('./content/actions.js');
            current = 'actions';
         break;
   
         // FALLBACK & INDEX
         default:
            sectionModule = require('./content/index.js');
            current = 'files';
         break;
      }

      sectionModule();
   }
});