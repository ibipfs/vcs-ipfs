var Mutable = require('./mutable.js');
var config = require('../config.js')();

// CLOSE PROMPT WINDOW
function closePrompt() {

   // CHECK CURRENT DISPLAY VALUE
   var value = $("#prompt").css('display');

   if (value == 'table') {

      // MAKE PARENT OPACITY ZERO AGAIN
      $('#prompt-space').css('opacity', '0');

      // WAIT FOR 0.2 SECONDS
      sleep(180).then(() => {

         // CSS HIDE SELECTOR
         $("#prompt").css('display', 'none');

         // REMOVE FROM DOM
         $('#prompt').remove();
      });
   }
}

// TRANSITION PROMPT BUTTONS EVENTS
function transitionButtons(_hash, _user) {

   // TURN OPACITY TO ZERO
   $('#left').css('opacity', '0');
   $('#right').css('opacity', '0');

   // SLEEP FOR 1.8s
   sleep(180).then(() => {

      // RECALIBRATE BUTTONS
      var buttons = new Buttons(_hash, _user);
      buttons.recalibrate();

      // TURN OPACITY TO MAX AGAIN
      $('#left').css('opacity', '1');
      $('#right').css('opacity', '1');
   });
}

// SAVE CACHE
function saveCache() {
   config.then((config) => {

      // PICK UP CACHE ID & VALUE
      var cache = $('#save-cache').attr('storage');

      // MAKE SURE SOMETHING IS CACHED
      if (cache != undefined && config.metamask.rights) {

         var value = window.editor.getValue();
         var split = cache.split('-');

         // SAVE TO CACHE
         localStorage.setItem(cache, value);
         log('Cache Set.');

         // TRANSITION
         transitionButtons(split[0], split[1]);
      } else {

         // FALLBACK ERROR
         log('Trying to save.')
      }

   });
}

// REMOVE CACHE
function removeCache() {
   config.then((config) => {

      // PICK UP CACHE ID & VALUE
      var cache = $('#remove-cache').attr('storage');

      // MAKE SURE SOMETHING IS CACHED
      if (cache != undefined && config.metamask.rights) {
         var split = cache.split('-');

         // SAVE TO CACHE
         localStorage.removeItem(cache);
         log('Cache Purged.')

         // TRANSITION
         transitionButtons(split[0]);
      
      } else {

         // FALLBACK ERROR
         log('Nothing is cached.')
      }

   });
}

// UPLOAD
function upload() {
   config.then((config) => {

      // PICK UP CACHE ID & VALUE
      var cache = $('#save-cache').attr('storage');
      var path = $('#path').text();

      // FORMAT PATH
      path = path.split(' / ');
      path = path.join('/');
      path = path.toLowerCase();

      // MAKE SURE SOMETHING IS CACHED
      if (cache != undefined && config.metamask.rights) {
         var mutable = new Mutable();

         // ADD TO IPFS
         mutable.add(cache).then((ret) => {
            log('Added to IPFS.');

            // NEW FILES HASH
            var hash = ret["0"].hash;

            // PARSE TRACKER FILE
            var tracker = config.tracker;

            // RELEVANT DATA
            var split = cache.split('-');
            var original_file = split[0];
            var user = split[1];
            var unix = unixTime();

            // CREATE SUBPROP IF MAIN PROP DOESNT EXIST
            if (tracker[original_file] == undefined) {
               tracker[original_file] = {};
            }

            // SET SELECTED VALUE AS THE LAST UPLOADED                        --- CHANGE
            tracker[original_file].selected = config.metamask.name;

            // PUSH NEW USER ENTRY
            tracker[original_file][user] = {
               hash: hash,
               timestamp: unix
            }

            // PUSH PATH FOR RENDERING PURPOSES
            tracker[original_file]['path'] = path;

            // STRINGIFY AGAIN
            var tracker = JSON.stringify(tracker);

            // OVERWRITE OLD TRACKER LOG
            mutable.write('tracker.json', tracker).then(() => {
               log('Added entry to Tracker.')

                  // PARSE LOG FILE
                  var activity = config.activity;
                  var type = 'upload';
                  
                  // ADD ENTRY
                  activity[unix] = {
                     type: type,
                     original: original_file,
                     user: user,
                     path: path,
                     hash: hash
                  }

                  // STRINGIFY AGAIN
                  activity = JSON.stringify(activity);

                  // OVERWRITE OLD LOG
                  mutable.write('activity.json', activity).then(() => {
                     log('Added entry to log.');

                  });
            });
         });

      } else {
         log('Tried to Upload.');
      }

   });
}

// EXPORT ALL FUNCTIONS
module.exports = {
   closePrompt: closePrompt,
   transitionButtons: transitionButtons,
   saveCache: saveCache,
   removeCache: removeCache,
   upload: upload
}