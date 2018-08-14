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
         var whitelist = ['activity.json', 'history.json', 'latest.json', 'tracker.json'];

         // IF BOTH ARRAYS ARE THE SAME
         if (compareArrays(list, whitelist) == false) {

            // NUKE LOGS IF SOMETHING IS MISSING
            this.nukeLogs(list);
         }
      });
   }

   // RESET ALL LOGS TO THEIR DEFAULT VALUE
   nukeLogs(files) {
      log('Nuking initiated!');
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
            var latestDefault = {
               "name": "1.0",
               "hash": "QmT6dnSEi9BXNBgWjExLHmEr9XpCbt5v1dRPcUM2Nr9D9p",
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