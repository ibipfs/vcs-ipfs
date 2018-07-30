class Immutable {

   // OPEN IPFS DIRECTORY
   dir (value) {
      return new Promise(function(resolve, reject) {
         ipfs.ls(value, function (err, files) {
            resolve(files);
         });
      });
   }

   // OPEN IPFS FILE
   file (value) {
      return new Promise(function(resolve, reject) {
         ipfs.files.cat(value, function (err, file) {
            resolve(file.toString('utf8'));
         });
      });
   }

   // SIMILAR TO FILE METHOD, BUT FETCHES BINARY DATA
   raw (value) {
      ipfs.files.cat(value, function (err, file) {
         resolve(file);
      });
   }

   // OVERVIEW OF DIR OR FILE
   get (value) {
      ipfs.files.get(value, function (err, content) {
         resolve(content);
      });
   }
}

// EXPORT CLASS
module.exports = Immutable;