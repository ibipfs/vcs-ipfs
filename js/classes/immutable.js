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
}

// EXPORT CLASS
module.exports = Immutable;