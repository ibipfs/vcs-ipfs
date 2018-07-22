var Mutable = require('./mutable.js')

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
function transitionButtons(_hash) {

   // TURN OPACITY TO ZERO
   $('#left').css('opacity', '0');
   $('#right').css('opacity', '0');

   // SLEEP FOR 1.8s
   sleep(180).then(() => {

      // RECALIBRATE BUTTONS
      var buttons = new Buttons(_hash);
      buttons.recalibrate();

      // TURN OPACITY TO MAX AGAIN
      $('#left').css('opacity', '1');
      $('#right').css('opacity', '1');
   });
}

// SAVE CACHE
function saveCache() {

   // PICK UP CACHE ID & VALUE
   var cache = $('#save-cache').attr('storage');

   // MAKE SURE SOMETHING IS CACHED
   if (cache != undefined && metamask.isLogged) {

      var value = 'I LOVE MEMES';
      var split = cache.split('-');

      // SAVE TO CACHE
      localStorage.setItem(cache, value);
      log('Cache Set.');

      // TRANSITION
      transitionButtons(split[0]);
   } else {

      // FALLBACK ERROR
      log('Trying to save.')
   }
}

// REMOVE CACHE
function removeCache() {

   // PICK UP CACHE ID & VALUE
   var cache = $('#remove-cache').attr('storage');

   // MAKE SURE SOMETHING IS CACHED
   if (cache != undefined && metamask.isLogged) {
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
}

function upload() {

   // PICK UP CACHE ID & VALUE
   var cache = $('#save-cache').attr('storage');
   var path = $('#path').text();

   // FORMAT PATH
   path = path.split(' / ');
   path = path.join('/');
   path = path.toLowerCase();

   // MAKE SURE SOMETHING IS CACHED
   if (cache != undefined && metamask.isLogged) {
      var mutable = new Mutable();

      // NUKE TRACKER
      //mutable.nukeLogs();

      // ADD TO IPFS
      mutable.add(cache).then((ret) => {
         log('Added to IPFS.');

         // NEW FILES HASH
         var hash = ret["0"].hash;

         // READ TRACKER FILE TO VAR
         mutable.read('tracker.json').then((file) => {

            // PARSE TRACKER FILE
            var tracker = JSON.parse(file);

            // RELEVANT DATA
            var split = cache.split('-');
            var original_file = split[0];
            var user = split[1];
            var unix = unixTime();

            // MAKE PROP FOR ORG FILE IF IT DOESNT EXIST
            if (tracker[original_file] == undefined) {
               tracker[original_file] = {};
               tracker[original_file]['path'] = path;
            };

            // PUSH NEW USER ENTRY
            tracker[original_file][user] = {
               hash: hash,
               timestamp: unix
            }

            // STRINGIFY AGAIN
            var tracker = JSON.stringify(tracker);

            // OVERWRITE OLD TRACKER LOG
            mutable.write('tracker.json', tracker).then((a) => {
               log('Added entry to Tracker.')

               // READ LOG FILE
               mutable.read('log.json').then((file) => {

                  // PARSE LOG FILE
                  var logz = JSON.parse(file);
                  var type = 'publish';
                  
                  // ADD ENTRY
                  logz[unix] = {
                     type: type,
                     original: original_file,
                     user: user,
                     path: path
                  }

                  // STRINGIFY AGAIN
                  logz = JSON.stringify(logz);

                  // OVERWRITE OLD LOG
                  mutable.write('log.json', logz).then(() => {
                     log('Added entry to log.');

                  });
               });
            });
         });
      });

   } else {
      log('Tried to Upload.');
   }
}

// EXPORT ALL FUNCTIONS
module.exports = {
   closePrompt: closePrompt,
   transitionButtons: transitionButtons,
   saveCache: saveCache,
   removeCache: removeCache,
   upload: upload
}