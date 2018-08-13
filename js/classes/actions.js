var Buffer = require('buffer/').Buffer
var Mutable = require('./mutable.js');
var config = require('../config.js')();

class Actions {

   release(significance) {
      config.then((config) => {

         var mutable = new Mutable();
         significance = significance.toLowerCase();

         // CURRENT ROOT DIR
         var base = config.history.current.hash;

         // FETCH CONTENT OF CURRENT VERSION
         promisify('get', base).then((content) => {

            // READ TRACKER FOR VERSION
            var tracker = config.tracker[config.history.current.name];
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
                        new_content = entry.content.toString('utf8');;
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
                  var new_hash = response[response.length - 1].hash;
               });

            });
         });
      });
   }

}

// EXPORT CLASS
module.exports = Actions;