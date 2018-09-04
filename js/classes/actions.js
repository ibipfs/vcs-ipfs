// SET WHAT RANKS HAVE RIGHT TO EDIT
var rights = ['master', 'admin', 'editor'];

// CLOSE INSPECTION WINDOW
function close() {
   
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

// TRANSITION INSPECT WINDOW BUTTONS
function transition_buttons(_hash, _user) {

   // FETCH & INSTANTIATE BUTTONS MODULE
   var Buttons = require('./buttons.js');
   var buttons = new Buttons(_hash, _user);

   // TURN OPACITY TO ZERO
   $('#left').css('opacity', '0');
   $('#right').css('opacity', '0');

   // SLEEP FOR 1.8s
   sleep(180).then(() => {

      // RECALIBRATE BUTTONS
      buttons.recalibrate();

      // TURN OPACITY TO MAX AGAIN
      $('#left').css('opacity', '1');
      $('#right').css('opacity', '1');
   });
}

// SAVE CACHE
function save() {
   var config = require('../config.js')();

   // REFRESH CONFIG
   config.then((config) => {

      // PICK UP CACHE ID & VALUE
      var cache = $('#save-cache').attr('storage');

      // MAKE SURE SOMETHING IS CACHED
      if (cache != undefined) {

         // MAKE SURE USER HAS PERMISSION
         if ($.inArray(config.metamask.permission, rights) != -1) {

            var value = window.editor.getValue();
            var split = cache.split('-');

            // SAVE TO CACHE
            localStorage.setItem(cache, value);
            log('Cache Set!');

            // TRANSITION BUTTONS
            transition_buttons(split[0], split[1]);

         } else { log('Permission Denied!'); }
      } else { log('Trying to save, but something wasnt right!'); }
   });
}

// REMOVE CACHE
function remove() {
   var config = require('../config.js')();

   // REFRESH CONFIG
   config.then((config) => {

      // PICK UP CACHE ID & VALUE
      var cache = $('#remove-cache').attr('storage');

      // MAKE SURE SOMETHING IS CACHED
      if (cache != undefined) {

         // MAKE SURE USER HAS PERMISSION
         if ($.inArray(config.metamask.permission, rights) != -1) {

            var split = cache.split('-');
   
            // SAVE TO CACHE
            localStorage.removeItem(cache);
            log('Cache Purged!')
   
            // TRANSITION BUTTONS
            transition_buttons(split[0]);
      
         } else { log('Permission Denied!'); }
      } else { log('Trying to purge cache, but nothing was found!'); }

   });
}

// UPLOAD TO IPFS & MODIFY LOGS
function upload() {
   var config = require('../config.js')();

   // REFRESH CONFIG
   config.then((config) => {

      // PICK UP CACHE ID & VALUE
      var cache = $('#save-cache').attr('storage');
      var path = $('#path').text();

      // FORMAT PATH
      path = path.split(' / ');
      path = path.join('/');
      path = path.toLowerCase();

      // MAKE SURE SOMETHING IS CACHED
      if (cache != undefined) {

         // MAKE SURE USER HAS PERMISSION
         if ($.inArray(config.metamask.permission, rights) != -1) {

            var Mutable = require('./mutable.js');
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

         } else { log('Permission Denied!'); }
      } else { log('Tried to upload, but something isnt right!'); }
   });
}

function release(significance) {
   var config = require('../config.js')();

   // REFRESH CONFIG
   config.then((config) => {

      // MAKE SURE USER IS THE CONTRACT MASTER
      if (config.metamask.permission == 'master') {

         // FORCE LOWERCASE ON USER SENT DATA
         significance = significance.toLowerCase();

         // CHECK IF TRACKER IS EMPTY
         if ($.isEmptyObject(config.tracker) == false) {
            log('Releasing new version..\n----');

            var Mutable = require('./mutable.js');
            var mutable = new Mutable();

            // CURRENT ROOT DIR
            var base = config.latest.hash;

            // FETCH CONTENT OF CURRENT VERSION
            promisify('get', base).then((content) => {

               // READ TRACKER FOR VERSION
               var tracker = config.tracker;
               var tracker_keys = Object.keys(tracker);

               // REF ARRAYS "EDITED"
               var edited_names = [];
               var edited_content = [];

               // LOOP THROUGH EACH KEY
               tracker_keys.forEach(entry => {

                  // IF SELECTED PROP FOR SUBENTRY IS SET TO TRUE
                  if (tracker[entry].selected != undefined && tracker[entry].selected != '') {

                     // FORMAT PATH
                     var path = tracker[entry].path;
                     path = path.split('/');
                     path[0] = base;
                     path = path.join('/');
                     path = path.toLowerCase()

                     // PUSH INTO EDITED ARRAYS
                     edited_names.push(path);
                     edited_content.push(tracker[entry][tracker[entry].selected].hash);
                  }
               });

               // EDITED PROMISES
               var edited_promises = [];

               // LOOP THROUGH REF ARRAY
               edited_content.forEach(entry => {
                     
                  // GENERATE PROMISE & PUSH
                  var promise = promisify('file', entry);
                  edited_promises.push(promise);
               });

               // WAIT FOR ALL PROMISES TO BE RESOLVED
               Promise.all(edited_promises).then((edited_values) => {

                  // ARRAY FOR COMPLETED NEW DIR
                  var files = [];

                  // LOOP THROUGH EACH ORIGINAL FILE
                  content.forEach(entry => {

                     // IF ENTRY IS A FILE
                     if (entry.content != undefined) {

                        // CHECK IF FILE NEEDS TO BE EDITED
                        var check_index = $.inArray(entry.path.toLowerCase(), edited_names);

                        // NEW CONTENT REF
                        var new_content = '';

                        // MATCH FOUND
                        if (check_index != -1) {
                           log(entry.path + ' needs to be edited!');

                           // FIX CASE SENSITIVE ISSUES
                           if (entry.path != edited_names[check_index]) {
                              edited_names[check_index] = entry.path;
                           }

                           // REPLACE OLD CONTENT WITH NEW
                           new_content = edited_values[check_index];

                        // DOESNT MATCH
                        } else {

                           // KEEP OLD CONTENT
                           new_content = entry.content.toString('utf8');
                        }

                        // GENERATE OBJECT FOR ENTRY
                        var obj = {
                           path: entry.path,
                           content: Buffer.from(new_content)
                        }

                        // PUSH OBJECT INTO ARRAY
                        files.push(obj);
                     }
                  });

                  // ADD CONSTRUCTED DIR TO IPFS
                  mutable.release(files).then((response) => {

                     log(response);

                     // FETCH NEW BASE -- USING SPLIT METHOD BECAUSE OF WEIRD RESPONSE BUG WITH CERTAIN DIRECTORIES
                     var new_base = response[response.length - 1].hash;

                     log(new_base);

                     // ASSESS NEW VERSION NAME
                     var old_name = parseFloat(config.latest.name);
                     var new_name = '';

                     // INCREMENT VERSION NAME BASED ON ADMIN INPUT
                     switch(significance) {

                        // MEDIUM
                        case 'medium':
                           new_name = old_name + 0.1;
                           new_name = new_name.toFixed(1);
                        break;

                        // LARGE
                        case 'large':
                           if (old_name % 1 != 0) { 
                              new_name = Math.ceil(old_name);
                           } else {
                              new_name = old_name + 1;
                              new_name = new_name.toFixed(1);
                           }
                        break;

                        // SMALL & FALLBACK
                        default:
                           new_name = old_name + 0.01;
                           new_name = new_name.toFixed(2);
                        break;
                     }

                     // CONVERT TO STRING
                     new_name = new_name.toString();

                     // GENERATE HISTORY ENTRY
                     config.history[old_name] = {
                        hash: config.latest.hash,
                        timestamp: config.latest.timestamp,
                        tracker: config.tracker
                     }

                     // WRITE NEW HISTORY LOG
                     mutable.write('history.json', JSON.stringify(config.history)).then(() => {
                        log('Wrote into history!');

                        // GENERATE LATEST ENTRY
                        config.latest = {
                           "name": new_name,
                           "hash": new_base,
                           "timestamp": unixTime()
                        }

                        // WRITE NEW LATEST LOG
                        mutable.write('latest.json', JSON.stringify(config.latest)).then(() => {
                           log('Wrote into latest!');
                           
                           config.tracker = {};

                           // RESET TRACKER FOR LATEST
                           mutable.write('tracker.json', JSON.stringify(config.tracker)).then(() => {
                              log('Reset tracker!');

                              // GENERATE ENTRY FOR ACTIVITY
                              config.activity[config.latest.timestamp] = {
                                 type: 'release',
                                 hash: new_base,
                                 name: new_name,
                              }

                              // WRITE ENTRY INTO ACTIVITY
                              mutable.write('activity.json', JSON.stringify(config.activity)).then(() => {
                                 log('Wrote into activity!');

                                 log('----\nRelease complete!')
                              });
                           });
                        });
                     });
                  });
               });
            });     
         } else { log('Aborting, tracker is empty!'); } 
      } else { log('Permission Denied!'); }
   });
}

function add(_name, _permission, _address) {
   var config = require('../config.js')();

   // REFRESH CONFIG
   config.then((config) => {
      
      // MAKE SURE USER IS THE CONTRACT MASTER
      if (config.metamask.permission == 'master') {
         
         // VALIDATE SUBMISSITED DATA
         if (_name.length != 0 && _address.length == 42) {

            // FETCH ACTIONS MODULE
            var Ethereum = require('../classes/ethereum.js');
            var ethereum = new Ethereum();

            // EXECUTE & LOG RESPONSE
            ethereum.add(name, permission, address).then((response) => {
               log(response);
            });

         } else { log('Aborting, improper submission data!'); }
      } else { log('Permission Denied!'); }
   });
}

// EXPORT INDIVIDUAL FUNCTIONS AS MODULES
module.exports = {
   close: close,
   transition_buttons: transition_buttons,
   save: save,
   remove: remove,
   upload: upload,
   release: release,
   add: add
}