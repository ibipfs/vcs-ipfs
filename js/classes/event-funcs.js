var Mutable = require('./mutable.js');
var config = require('../config.js')();

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