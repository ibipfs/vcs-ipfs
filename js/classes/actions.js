var Buffer = require('buffer/').Buffer
var Mutable = require('./mutable.js');
var config = require('../config.js')();

class Actions {

   release(significance) {
      config.then((config) => {
         log('Releasing new version..\n----')

         var mutable = new Mutable();
         significance = significance.toLowerCase();

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
                              user: config.metamask.name
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
      });
   }

   // ADD USER TO WHITELIST
   add(_name, _address) {
      return new Promise(function(resolve, reject) {
         contract.whitelist(_address, function(error, result) {
   
            // IF ENTRY DOESNT ALREADY EXIST IN MAP
            if (result[0] == '') {
   
               // ADD ENTRY
               contract.add(_name, _address, function(error, result) {
                  if (error) {
                     log(error);
                  } else {
                     resolve('Added "' + _name + '" to the whitelist!');
                  }
               });
   
            } else {
               resolve('That user already exists!');
            }
   
         });
      });
   }

}

// EXPORT CLASS
module.exports = Actions;