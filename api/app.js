// ESTABLISH CONNECTION TO IPFS PEER
var ipfs = window.IpfsApi('192.168.1.34', '5001');

// DIRECTORY URL
var validCID = 'QmUfiUfPtE8Yv6tim9bFSanQrZMJR7NgH4ACgeU2zbQwJE';
parseDir(validCID);

// PARSE DIRECTORY
function parseDir(_hash) {
   var build = {};

   // STAGE 1 -- ADD DIRECTORIES TO OBJECT
   promisify('dir', _hash).then((files) => {
      files.forEach((file) => {

         // PUSH DIRECTORIES INTO OBJECT
         var parent = file.name;
         build[parent] = {
            hash: file.hash
         };

      });

   // STAGE 2 -- ADD FILES
   }).then(() => {

      // OBJECT KEYS
      var keys = Object.keys(build);

      // LOOP
      keys.forEach((key) => {
         
         // CHILD DIR PROMISE
         promisify('dir', build[key].hash).then((files) => {
            files.forEach((file) => {

               // PUSH FILES INTO OBJECT
               build[key][file.name] = {
                  name: file.name,
                  hash: file.hash,
                  size: file.size,
                  path: file.path
               }

            });

         // STAGE 3 -- RENDER
         }).then(() => {

            var stringify = JSON.stringify(build);
            var minify = vkbeautify.jsonmin(stringify);
            var beautify = vkbeautify.json(minify);
            $('code').text(beautify);

         });
      });

   });
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

function log(stuff) {
   console.log(stuff);
}

// HASH BASED ON JSON CONTENT
function contentHash(obj) {
   var string = JSON.stringify(obj);
   var string = vkbeautify.jsonmin(string);
   var string = md5(string);

   return string;
}