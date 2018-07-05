function log(stuff) {
   console.log(stuff);
}

// WRAP BLOCKCHAIN QUERIES INTO PROMISES
function promisify(query, value = null) {
   return new Promise(function(resolve, reject) {

      switch(query) {

         // FETCH IPFS DIRECTORY CONTENT
         case 'dir':
            ipfs.ls(value, function (err, files) {
               resolve(files);
            });
         break;

         // FALLBACK
         default:
            log('Error in Promisify Switch.')
         break;
      }

   });
}