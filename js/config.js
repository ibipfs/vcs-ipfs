// FETCH & INSTANTIATE MODULES
var Mutable = require('./classes/mutable.js');
var mutable = new Mutable();

var Immutable = require('./classes/immutable.js');
var immutable = new Immutable();

function build() {

   // GENERATE PROMISES
   var history = mutable.read('history.json');
   var tracker = mutable.read('tracker.json');
   var log = mutable.read('log.json');
   var metamask = immutable.metamask();

   // WAIT FOR ALL PROMISES TO BE RESOLVED
   return Promise.all([history, tracker, log, metamask]).then((values) => {

      // PARSE LOGS
      history = JSON.parse(values[0]);
      tracker = JSON.parse(values[1]);
      log = JSON.parse(values[2]);
      metamask = values[3];

      // CREATE CONFIG OBJECT
      var config = {};

      // ADD LOGS TO CONFIG
      config.history = history;
      config.tracker = tracker;
      config.log = log;

      // METAMASK LOGIC
      var whitelist = ['0x8a1fe5accc4ee542917058236f6c9cbac8f2b74e', '0x83dea6e4a7d7fdea1e1ee9f1c0284cdf27bac69b'];
      var names = ['wickstjo', 'mydude'];

      // DEFAULT VALUES
      config.metamask = {};
      config.metamask.session = false;
      config.metamask.name = null;
      config.rights = false;

      // IF LENGTH EQUALS ONE, USER IS LOGGED IN
      if (metamask.length == 1) {

         // IF IT IS, SET SESSION PROP
         config.metamask.session = true;

         // CHECK IF THAT USER IS WHITELISTED
         var check = $.inArray(metamask[0], whitelist);

         // IF HE IS, SET NAME PROP
         if (check != -1) {
            config.metamask.name = names[check];
            config.rights = true;
         }
      }

      metamask_css(config.metamask);

      // RETURN CONFIG
      return config;
   });
}

// CHANGE CSS OF METAMASK BLOCK
function metamask_css(metamask) {

   // PLACEHOLDERS
   var text;
   var bg;
   var border;

   // CHECK FOR SESSION
   if (metamask.session == true) {

      // CHECK WHITELIST
      if (metamask.name != null) {

         text = 'MetaMask Connected - ' + metamask.name;
         bg = 'success';
         border = '#B5D0C6';

      } else {

         text = 'MetaMask Found - Unknown User';
         bg = 'caution';
         border = '#dada8b';

      }

   // NO SESSION FOUND
   } else {

      text = 'MetaMask Session Not Found';
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