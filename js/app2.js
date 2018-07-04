var validCID = 'QmQ4mjoN7CNtDgpQTCL8f8CSY35j3ANQxzCdnTvK7TUAW7';

promisify('file', validCID).then((file) => {
   console.log(file);
});

// WRAP BLOCKCHAIN QUERIES INTO PROMISES
function promisify(query, value = null) {
   return new Promise(function(resolve, reject) {
 
      switch(query) {
 
         // FETCH NUMBER OF RECORDS
         case 'metamask':
            web3.eth.getAccounts(function(err, result) {
               if (err) {
                  log('MetaMask Error: ' + err)
               } else {
                  resolve(result);
               }
            });
         break;

         // FETCH IPFS DIRECTORY CONTENT
         case 'dir':
            ipfs.ls(value, function (err, files) {
               resolve(files);
            });
         break;

         // FETCH IPFS FILE CONTENT
         case 'file':
            ipfs.files.cat(value, function (err, file) {
               if (err) {console.log(err)}
               resolve(file.toString('utf8'));
            });
         break;
 
         // FALLBACK
         default:
            log('Error in Promisify Switch.')
         break;
      }
 
   });
}