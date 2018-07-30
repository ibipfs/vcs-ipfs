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
               resolve(file.toString('utf8'));
            });
         break;

         // FETCH RAW IPFS FILE DATA
         case 'raw':
            ipfs.files.cat(value, function (err, file) {
               resolve(file);
            });
         break;

         // GET INFO FROM IPFS SOURCE
         case 'get':
            ipfs.files.get(value, function (err, content) {
               resolve(content);
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

      // SOLIDITY
      case 'sol':
         name = 'solidity';
      break;

      // FALLBACK
      default:
         name = suffix;
      break;
   }

   return name;
}

// REFORMAT PATH HEADER FOR LISTING
function formatPath(path) {
   var split = path.split('/');
   split[0] = 'Root';
   
   for (var x = 0; x < split.length; x++) {
      split[x] = capitalize(split[x]);
   }

   var string = split.join(' / ');
   return string;
}

// CAPITALIZE STRING
function capitalize(string) {
   return string.charAt(0).toUpperCase() + string.slice(1);
}

// BEAUTIFY CODE
function beautify(code, type) {
   type.toLowerCase();

   switch (type) {

      // CSS
      case 'css':
         code = vkbeautify.cssmin(code);
         code = vkbeautify.css(code);
      break;

      // JSON
      case 'json':
         code = vkbeautify.jsonmin(code);
         code = vkbeautify.json(code);
      break;
      
   }

   return code;
}

// CHECK IF TWO ARRAYS ARE THE SAME
function compareArrays(first, second) {
   var value = false;
   var num = 0;

   if (first.length == second.length) {
      for (var x = 0; x < first.length; x++) {
         if (first[x] == second[x]) {
            num++;
         }
      }

      if (num == first.length) {
         value = true;
      }
   }

   return value;
}

// CSS TRANSITION WITH OPACITY
function fadeIn(selector, content, purge = false) {

   // TURN OPACITY DOWN
   $('#' + selector).css('opacity', '0');

   sleep(180).then(() => {

      // PURGE SELECTOR IF TRUE
      if (purge == true) {
         $('#' + selector).html('');
      }

      // TURN OPACITY UP
      $('#' + selector).css('opacity', '1');

      // RENDER TO SELECTOR
      $('#' + selector).html(content)
   });
}

// FORMAT FILE PATH
function headerify(path, lowercase = false) {
   path = path.split('/');

   // SET FIRST KEY TO ROOT
   path[0] = 'root';

   // DEFAULT
   if (lowercase == false) {
         
      for (var x = 0; x < path.length; x++) {
         path[x] = capitalize(path[x]);
      }

      // WITH SPACES
      path = path.join(' / ');

   // IF LOWERCASE IS TRUE
   } else {

      // WITHOUT SPACES
      path = path.join('/');
   }

   return path;
}

function unixTime() {
   var time = Math.round(+new Date()/1000);
   return time;
}