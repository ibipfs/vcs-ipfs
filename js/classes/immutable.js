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

   // ANALYZE METAMASK DATA VIA WEB3
   metamask() {
      return new Promise(function(resolve, reject) {
         web3.eth.getAccounts((err, result) => {
            if (err) {
               log('MetaMask Error: ' + err)
            } else {
               resolve(result);
            }
         });
      });
   }

   // FETCH SMART CONTRACT ADMIN ADDRESS
   admin() {
      return new Promise(function(resolve, reject) {
         contract.admin((err, result) => {
            if (err) {
               log('Smart Contract Error: ' + err)
            } else {
               resolve(result);
            }
         });
      });
   }
}

// EXPORT CLASS
module.exports = Immutable;