var Buffer = require('buffer/').Buffer

class Mutable {

   // CHECK THAT LOG FILES EXIST
   constructor() {
      this.check();
   }

   // MAKE DIRECTORY
   mkdir(dir) {
      return new Promise(function(resolve, reject) {
         ipfs.files.mkdir('/' + dir, (err) => {
            if (err) {
               log(err)
            } else {
               resolve(dir);
            }
         });
      });
   }
   
   // LIST
   ls(dir = '') {
      return new Promise(function(resolve, reject) {
         ipfs.files.ls('/' + dir, function (err, files) {
            if (err) {
               log(error);
            } else {
               resolve(files);
            }
         });
      });
   }
   
   // FLUSH
   flush(file = '') {
      return new Promise(function(resolve, reject) {
         ipfs.files.flush('/' + file, (err) => {
            if (err) {
               log(err);
            } else {
               resolve();
            }
         });
      });
   }
   
   // REMOVE FILE/DIR -- RECURSIVELY
   rm(path) {
      return new Promise(function(resolve, reject) {
         ipfs.files.rm('/' + path, { recursive: true }, (err) => {
            if (err) {
               log(err);
            } else {
               resolve();
            }
         });
      });
   }

   // COPY
   cp(from, to) {
      return new Promise(function(resolve, reject) {
         ipfs.files.cp('/' + from, '/' + to, (err) => {
            if (err) {
               log(err)
            } else {
               log('Copied "' + from + '" to "' + to + '"');
            }
         });
      });
   }

   // READ
   read(path) {
      return new Promise(function(resolve, reject) {
         ipfs.files.read('/' + path, (error, buf) => {
            resolve(buf.toString('utf8'));
         });
      });
   }

   // WRITE
   write(path, content) {
      return new Promise(function(resolve, reject) {
         ipfs.files.write('/' + path, Buffer.from(content), { truncate: true, create: true }, (err, res) => {
            if (err) {
               log(err)
            } else {
               resolve(res);
            }
         });
      });
   }

   // CHECK IF LOGFILES EXIST
   check() {
      this.ls().then((files) => {
         var keys = Object.keys(files);
         var list = [];

         // CREATE ARRAY OF EXISTING VIRTUAL FILES
         for (var x = 0; x < keys.length; x++) {
            list.push(files[keys[x]].name);
         }

         // WHITELIST
         var whitelist = ['history.json', 'log.json', 'settings.json', 'tracker.json'];

         // IF BOTH ARRAYS ARE THE SAME
         if (compareArrays(list, whitelist) == false) {

            // NUKE LOGS IF SOMETHING IS MISSING
            this.nukeLogs(list);
         }
      });
   }

   // RESET ALL LOGS TO THEIR DEFAULT VALUE
   nukeLogs(files) {
      log('Log file(s) missing. Nuking initiated!');
      var promiseList = [];

      // CREATE A PROMISE FOR EACH EXISTING FILE/DIR
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
            var historyDefault = {
               "current": {
                  "name": "1.0",
                  "hash": "QmWNzgNRMmBuLTExntzTELo4cgAGnhdVYBPGkdLek1iVxZ",
                  "timestamp": unixTime()
               },
            
               "old": {
               }
            }

            // NUKE HISTORY
            this.write('history.json', JSON.stringify(historyDefault)).then(() => {
               log('History Log created!');

               // DEFAULT LOG CONTENT
               var logDefault = {};
               
               // NUKE LOG
               this.write('log.json', JSON.stringify(logDefault)).then(() => {
                  log('Log created!');

                  // DEFAULT SETTINGS CONTENT
                  var settingsDefault = {};

                  // NUKE SETTINGS
                  this.write('settings.json', JSON.stringify(settingsDefault)).then(() => {
                     log('Settings created!');

                     // LOG VIRTUAL CONTENT
                     this.ls().then((ls) => {
                        log(ls);
                        log('Nuking Complete!')
                     });
                     
                  });
               });
            });
         });
      });
   }

   // ADD TO IPFS
   add(cacheName) {
      return new Promise(function(resolve, reject) {
         var content = localStorage.getItem(cacheName);

         ipfs.files.add(Buffer.from(content), function (err, res) {
            resolve(res);
         });
      });
   }

   // RELEASE NEW VERSION
   release(fileArray) {
      return new Promise(function(resolve, reject) {
         ipfs.files.add(fileArray, (err, res) => {
            if (err) {
               log(err);
            } else {
               resolve(res);
            }
         });
      });
   }

}

// EXPORT CLASS
module.exports = Mutable;