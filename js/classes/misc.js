// CONSOLE LOG SHORTHAND
function log(stuff) {
   console.log(stuff);
}

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

         // FETCH IPFS FILE DATA
         case 'file':
            ipfs.files.cat(value, function (err, file) {
               resolve(file);
            });
         break;
 
         // FALLBACK
         default:
            log('Error in Promisify Switch.')
         break;
      }
 
   });
}

// SLEEP FUNC FOR PROMPT TRANSITIONS
function sleep (time) {
   return new Promise((resolve) => setTimeout(resolve, time));
}

// FETCH SPECIFIC INFO FROM DIR OBJECT
function fetchData(obj, fileName) {
   var keys = Object.keys(obj);
   var data = {};

   keys.forEach((key) => {
      if (obj[key].name == fileName) {
         data = obj[key];
      }
   });

   return data;
}

// CHANGE FILE SUFFIX TO LANGUAGE
function findLang(suffix) {
   var name = '';

   switch(suffix) {

      // JAVASCRIPT
      case 'js':
         name = 'javascript';
      break;

      // FALLBACK
      default:
         name = suffix;
      break;
   }

   return name;
}