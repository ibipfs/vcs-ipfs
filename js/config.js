// FETCH & INSTANTIATE MODULES
var Mutable = require('./classes/mutable.js');
var mutable = new Mutable();

// FETCH SMART CONTRACT MODULE
var Ethereum = require('./classes/ethereum.js');
var ethereum = new Ethereum();

function build() {

   // GENERATE PROMISES
   var latest = mutable.read('latest.json');
   var history = mutable.read('history.json');
   var tracker = mutable.read('tracker.json');
   var activity = mutable.read('activity.json');
   var sessions = ethereum.sessions();

   // WAIT FOR ALL PROMISES TO BE RESOLVED
   return Promise.all([latest, history, tracker, activity, sessions]).then((values) => {

      // LIST OF METAMASK SESSIONS
      var addresses = values[4];

      // CREATE CONFIG OBJECT
      var config = {};

      // ADD LOG PROPS TO OBJECT
      config.latest = JSON.parse(values[0]);
      config.history = JSON.parse(values[1]);
      config.tracker = JSON.parse(values[2]);
      config.activity = JSON.parse(values[3]);
      config.metamask = {};

      // LIST OF METAMASK SESSIONS
      var addresses = values[4];

      // CHECK FOR ACTIVE METAMASK SESSION
      if (addresses.length == 1) {

         // SET METAMASK SESSION PROP
         config.metamask.session = true;

         // CHECK SMART CONTRACT WHITELIST
         return ethereum.user_info(addresses[0]).then((user_data) => {

            // IF STRUCT EXISTS IN MAP -- WORKAROUND B/C UINT256 RETURNED AS ARRAY
            if (user_data[2].c[0] != 0) {

               // SAVE ADDRESS NAME PROP TO CONFIG
               config.metamask.name = user_data[0];
               config.metamask.permission = user_data[1];
               config.metamask.address = addresses[0];

               // LOG FOR CLARITY & RETURN
               log(config);
               metamask_css(config.metamask);
               return config;

            // USER STRUCT DOESNT EXIST
            } else {

               // LOG FOR CLARITY & RETURN
               log(config);
               metamask_css(config.metamask);
               return config;
            }
         });

      // NO METAMASK SESSIONS
      } else {
            
         // LOG FOR CLARITY & RETURN
         log(config);
         metamask_css(config.metamask);
         return config;
      }
   });
}

// CHANGE CSS OF ethereum BLOCK
function metamask_css(metamask) {

   // PLACEHOLDERS
   var text;
   var bg;
   var border;

   // CHECK FOR SESSION
   if (metamask.session == true) {

      // FOUND IN WHITELIST
      if (metamask.name != undefined) {

         text = 'Metamask Connected - ' + metamask.name;
         bg = 'success';
         border = '#B5D0C6';

      // NOT FOUND
      } else {

         text = 'Metamask Connected - Unknown User';
         bg = 'caution';
         border = '#dada8b';
      }

   // NO SESSION FOUND
   } else {

      text = 'No Metamask Session Found';
      bg = 'error';
      border = '#CCAAAA';
   }

   // FINALLY RENDER APPROPRIATELY
   $('#metamask').text(text);
   $('#metamask').css('background', "url('interface/img/" + bg + ".png')");
   $('#metamask').css('border', 'thin solid' + border);
}

// EXPORT FUNCTION
module.exports = build;