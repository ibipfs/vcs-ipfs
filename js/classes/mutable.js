// FETCH BUFFER PACKAGE TO CONVERT STRINGS TO BINARY ARRAYS
var Buffer = require('buffer/').Buffer

class Mutable {

   // CHECK CONTENT OF VIRTUAL IPFS DIRECTORY
   constructor() { this.checkLogs(); }
   
   // LIST OUT DIR CONTENT
   ls(dir = '') { return ipfs.files.ls('/' + dir); }
   
   // REMOVE FILE -- RECURSIVELY
   rm(path) { return ipfs.files.rm('/' + path, { recursive: true }); }

   // FETCH FILE CONTENT -- BINARY ARRAY -- .toString('utf8')
   read(path) { return ipfs.files.read('/' + path); }

   // WRITE INTO FILE -- OVERWRITE IF FILE EXISTS & CREATE IF NOT
   write(path, content) { return ipfs.files.write('/' + path, Buffer.from(content), { truncate: true, create: true }); }

   // CHECK IF LOGFILES EXIST
   checkLogs() {
      this.ls().then((files) => {
         var keys = Object.keys(files);
         var list = [];

         // CREATE ARRAY OF EXISTING VIRTUAL FILES
         for (var x = 0; x < keys.length; x++) {
            list.push(files[keys[x]].name);
         }

         // WHITELIST
         var whitelist = ['tracker.json', 'latest.json', 'history.json', 'activity.json'];

         // IF BOTH ARRAYS ARE THE SAME
         if (compareArrays(list, whitelist) == false) {

            // LOG DETAILS FOR CLARITY
            log('Expected files:');
            log(whitelist);
            log('Current files:');
            log(files);

            // NUKE LOGS IF SOMETHING IS MISSING
            this.nukeLogs(list);
         }
      });
   }

   // RESET ALL LOGS TO THEIR DEFAULT VALUE
   nukeLogs(files) {
      log('\nNuking initiated!');

      // GENERATE & PUSH A PROMISE FOR REMOVING ALL OLD CONTENT
      var promiseList = [];
      
      for (var x = 0; x < files.length; x++) {
         promiseList.push(this.rm(files[x]));
      }

      // WAIT FOR ALL PROMISES TO GET RESOLVED
      Promise.all(promiseList).then(() => {
         log('Old files removed!');

         // DEFAULT TRACKER CONTENT
         var trackerDefault = {};

         // NUKE TRACKER
         this.write('tracker.json', JSON.stringify(trackerDefault)).then(() => {
            log('Tracker Log created!');
            
            // DEFAULT HISTORY CONTENT
            var latestDefault = {
               "name": "1.0",
               "hash": "QmQsztuBTtghvcnHjbpwuH9da9EVCeYvdYBvQXRe7GAa6C",
               "timestamp": unixTime()
            }

            // NUKE LATEST
            this.write('latest.json', JSON.stringify(latestDefault)).then(() => {
               log('Latest Log created!');

               // DEFAULT LOG CONTENT
               var historyDefault = {};
               
               // NUKE HISTORY
               this.write('history.json', JSON.stringify(historyDefault)).then(() => {
                  log('History log created!');
                  
                  // DEFAULT ACTIVITY CONTENT
                  var activityDefault = {};
                  
                  // NUKE ACTIVITY
                  this.write('activity.json', JSON.stringify(activityDefault)).then(() => {
                     log('Activity log created!');

                     log('Nuking complete!')
                  });
               });
            });
         });
      });
   }
}

// EXPORT CLASS AS MODULE
module.exports = Mutable;