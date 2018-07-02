var ipfs = window.IpfsApi('localhost', '5001');

const validCID = 'QmVDHzcrfJgAx31v6epD5SmpGF1qFoTHj95VLdqR4DLEC7'

// ipfs.ls(validCID, function (err, files) {
//   files.forEach((file) => {
//     console.log(file.path)
//   })
// })

var foo = {};
setBuild(foo);

parseDir(validCID);
log(getBuild());

function parseDir(_hash) {

   ipfs.ls(_hash, function (err, files) {

      // CONTENT TYPES
      var types = ['dir', 'file'];

      // LOOP ONE TYPE AT A TIME
      for (var x = 0; x < types.length; x++) {

         files.forEach((file) => {

            if (file.type == types[x]) {
               var str = file.type + ' / ' + file.name;

               var build = getBuild();
               build[str] = {};
               setBuild(build);
               log(getBuild());

               // if (file.type == types[0]) {
               //    parseDir(file.hash);
               // }
            }

         });

      }

   });

}

function log(stuff) {
   console.log(stuff);
}

function getBuild() {
   var ret = JSON.parse(localStorage.getItem('build'));
   return ret;
}

function setBuild(obj) {
   localStorage.setItem('build', JSON.stringify(obj));
}