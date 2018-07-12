var Buffer = require('buffer/').Buffer

class Mutable {

   // MAKE DIRECTORY
   mkdir(dir) {
      ipfs.files.mkdir('/' + dir, (err) => {
         if (err) {
         console.error(err)
         } else {
            log('Added: "' + dir + '"');
         }
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

   list() {
      var list = this.ls();

      list.then((object) => {
         log(object);
      });
   }
   
   // FLUSH
   flush() {
      var flush =  new Promise(function(resolve, reject) {
         ipfs.files.flush('/', (err) => {
            if (err) {
               log(err);
            } else {
               resolve();
            }
         });
      });

      flush.then(() => {
         log('Flushed Successfully!')
      });
   }
   
   // REMOVE DIR
   rmDir(dir) {
      ipfs.files.rm('/' + dir, { recursive: true }, (err) => {
         if (err) {
            log(err);
         } else {
            log('Removed dir "' + dir + '"')
         }
      });
   }

   // REMOVE FILE
   rmFile(file) {
      ipfs.files.rm('/' + file, (err) => {
         if (err) {
            log(err);
         } else {
            log('Removed file "' + file + '"')
         }
      });
   }

   // COPY
   cp(from, to) {
      ipfs.files.cp('/' + from, '/' + to, (err) => {
         if (err) {
            log(err)
         } else {
            log('Copied "' + from + '" to "' + to + '"');
         }
      })
   }

   // READ
   read(path) {
      ipfs.files.read('/' + path, (error, buf) => {
         log(buf.toString('utf8'));
       });
   }

   // WRITE
   write(path, content) {
      return new Promise(function(resolve, reject) {
         ipfs.files.write('/' + path, Buffer.from(content), { truncate: true, create: true }, (err) => {
            if (err) {
               log(err)
            } else {
               resolve(path);
            }
         });
      });
   }

   // PURGE EVERYTHING FROM VIRTUAL ROOT
   purge(files, keys) {
      keys.forEach((key) => {
         var name = files[key].name;
         var split = name.split('.');

         if (split.length == 1) {

            // REMOVE DIR
            this.rmDir(name);

         } else {

            // REMOVE FILE
            this.rmFile(name);
         }

         // FLUSH TO SAVE
         this.flush();
      });
   }

   // CREATE NECESSARY LOGS
   spawn() {

      // HISTORY LOG OBJECT
      var historyObj = {
         "current": {
            "name": "",
            "hash": "",
            "timestamp": 0
         },
      
         "old": {
         }
      }

      // TRACKER LOG OBJECT
      var trackerObj = {}

      // MAKE PROMISES FOR FILES
      var history = this.write('history.json', JSON.stringify(historyObj));
      var tracker = this.write('tracker.json', JSON.stringify(trackerObj));

      // WAIT FOR THEM TO RESOVLE
      Promise.all([history, tracker]).then(function(values) {

         // LOG MESSAGE
         log('Created the following files:');

         $.each(values, function(i, name) {
            log('- ' + name);
         });

         // FLUSH TO SAVE
         this.flush();
      });
   }

   // CHECK IF LOGS EXIST
   check() {
      var list = this.ls();
      var whitelist = ['history.json', 'tracker.json'];
      
      // WAIT FOR PROMISE
      list.then((files) => {
         var keys = Object.keys(files);

         // IF LENGTH DOESNT MATCH WHITELIST
         if (keys.length != whitelist.length) {

            // IF NOT
            this.purge(files, keys);
            this.spawn();

         } else {

            // SAVE OBJECT KEY.NAMES INTO ARRAY
            var names = [];
            keys.forEach((key) => {
               var name = files[key].name;
               names.push(name);
            });

            // CHECK IF VALUES IN BOTH ARRAYS MATCH
            if (names[0] != whitelist[0] || names[1] != whitelist[1]) {

               // IF NOT
               this.purge(files, keys);
               this.spawn();

            } else {

               // IF THEY DO
               log('Check found no isses!');
            }
         }
      });
   }

}

module.exports = Mutable;