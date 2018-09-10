// LIST OUT DIR CONTENT
function list(dir = '') { return ipfs.files.ls('/' + dir); }

// REMOVE FILE -- RECURSIVELY
function remove(path) { return ipfs.files.rm('/' + path, { recursive: true }); }

// FETCH FILE CONTENT -- BINARY ARRAY -- .toString('utf8')
function read(path) { return ipfs.files.read('/' + path); }

// WRITE INTO FILE -- OVERWRITE IF FILE EXISTS & CREATE IF NOT
function write(path, content) {
   var Buffer = require('buffer/').Buffer;
   return ipfs.files.write('/' + path, Buffer.from(content), { truncate: true, create: true });
}

// CHECK IF LOGFILES EXIST
function check_logs(reset = false) {
   list().then((files) => {
      var keys = Object.keys(files);
      var list = [];

      // CREATE ARRAY OF EXISTING VIRTUAL FILES
      for (var x = 0; x < keys.length; x++) {
         list.push(files[keys[x]].name);
      }

      // WHITELIST
      var whitelist = ['tracker.json', 'latest.json', 'history.json', 'activity.json'];

      // IF BOTH ARRAYS ARE THE SAME
      if (compareArrays(list, whitelist) == false || reset == true) {

         // LOG DETAILS FOR CLARITY
         log('Expected files:');
         log(whitelist);
         log('Current files:');
         log(list);

         // NUKE LOGS IF SOMETHING IS MISSING
         nuke_logs(list);
      }
   });
}

// RESET ALL LOGS TO THEIR DEFAULT VALUE
function nuke_logs(files) {
   log('\nNuking initiated!');

   // GENERATE & PUSH A PROMISE FOR REMOVING ALL OLD CONTENT
   var promiseList = [];
   
   for (var x = 0; x < files.length; x++) {
      promiseList.push(remove(files[x]));
   }

   // WAIT FOR ALL PROMISES TO GET RESOLVED
   Promise.all(promiseList).then(() => {
      log('Old files removed!');

      // DEFAULT TRACKER CONTENT
      var trackerDefault = {};

      // NUKE TRACKER
      write('tracker.json', JSON.stringify(trackerDefault)).then(() => {
         log('Tracker Log created!');
         
         // DEFAULT HISTORY CONTENT
         var latestDefault = {
            "name": "1.0",
            "hash": "QmajVZUfnV7ne7hnn8Jr968wWhKxn7HtsoJ8SWAM4aDnLR",
            "timestamp": unixTime()
         }

         // NUKE LATEST
         write('latest.json', JSON.stringify(latestDefault)).then(() => {
            log('Latest Log created!');

            // DEFAULT LOG CONTENT
            var historyDefault = {};
            
            // NUKE HISTORY
            write('history.json', JSON.stringify(historyDefault)).then(() => {
               log('History log created!');
               
               // DEFAULT ACTIVITY CONTENT
               var activityDefault = {};
               
               // NUKE ACTIVITY
               write('activity.json', JSON.stringify(activityDefault)).then(() => {
                  log('Activity log created!');

                  log('Nuking complete!');
               });
            });
         });
      });
   });
}

// EXPORT INDIVIDUAL FUNCTIONS AS MODULES
module.exports = {
   list: list,
   remove: remove,
   read: read,
   write: write,
   check_logs: check_logs
}