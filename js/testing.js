var Buffer = require('buffer/').Buffer

class Mutable {
 
   // WRITE
   write(path, content) {
      ipfs.files.write('/' + path, Buffer.from(content), {truncate: true}, (err) => {
         if (err) {
            log(err)
         } else {
            log('Wrote to file.');
         }
      });
   }

   // READ
   read(path) {
      ipfs.files.read('/' + path, (error, buf) => {
         log(buf.toString('utf8'));
         });
   }

   // FLUSH
   flush() {
      ipfs.files.flush('/mutable', (err) => {
         if (err) {
            log(err);
         } else {
            log('Flushed.')
         }
      });
   }
 
}

var mutable = new Mutable();

mutable.read('mutable/one.js');
mutable.write('mutable/one.js', 'moro');
mutable.flush();
mutable.read('mutable/one.js');