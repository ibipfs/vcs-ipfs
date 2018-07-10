var Buffer = require("buffer")

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
      ipfs.files.ls('/' + dir, function (err, files) {
         if (err) {
            log(err);
         } else {
            log('Listing Content.');
            log(files);
         }
      });
   }
   
   // FLUSH
   flush() {
      ipfs.files.flush('/', (err) => {
         if (err) {
            log(err);
         } else {
            log('Flushed.')
         }
      });
   }
   
   // REMOVE
   rm(dir) {
      ipfs.files.rm('/' + dir, { recursive: true }, (err) => {
         if (err) {
            log(err);
         } else {
            log('Removed "' + dir + '"')
         }
      });
   }

   // COPY
   cp(from, to) {
      // To copy a directory
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
      ipfs.files.write('/' + path, Buffer.from(content), (err) => {
         if (err) {
            log(err)
         } else {
            log('Wrote to file.');
         }
      });
   }

}