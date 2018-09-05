// CONSOLE LOG SHORTHAND
function log(stuff) {
   console.log(stuff);
}

// SLEEP FUNC FOR PROMPT TRANSITIONS
function sleep (time) {
   return new Promise((resolve) => setTimeout(resolve, time));
}

// FETCH SPECIFIC INFO FROM AN OBJECT
function fetch_data(obj, filename) {
   var keys = Object.keys(obj);
   var data = {};

   // LOOP THROUGH OBJECT
   keys.forEach((key) => {

      // GENERATE RETURN OBJECT IF INPUT MATCHES OBJECT KEY
      if (obj[key].name == filename) {
         data = obj[key];
      }
   });

   return data;
}

// FORMATS PATH
function format_path(path) {
   path = path.split(' / ');
   path = path.join('/');
   path = path.toLowerCase();

   return path;
}

// FORMAT FILE PATH
function headerify(path, lowercase = false) {

   // REMOVE SPACES & SPLIT ON SLASH
   path = path.trim();
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
      path = path.toLowerCase();
   }

   return path;
}

// GET FILE PARENT
function file_details(path) {

   // RETURN OBJ
   var details = {};

   // SPLIT ON SLASH
   var split = path.split('/');

   // SEPARATE & PUSH FILENAME
   var filename = split.pop();
   details.filename = filename;

   // STITCH REMAINS TOGETHER TO FORM PARENT DIR
   var parent = split.join('/');
   details.parent = parent;

   // FIND LANGUAGE BASED ON SUFFIX
   var suffix = filename.split('.');
   suffix = suffix[suffix.length - 1];
   var lang = '';
   
   switch(suffix) {

      // JAVASCRIPT
      case 'js':
         lang = 'javascript';
      break;

      // SOLIDITY
      case 'sol':
         lang = 'solidity';
      break;

      // FALLBACK
      default:
         lang = suffix;
      break;
   }

   // PUSH LANGUAGE INTO OBJ
   details.lang = lang;

   return details;
}

// CAPITALIZE STRING
function capitalize(string) {
   return string.charAt(0).toUpperCase() + string.slice(1);
}

// CHECK IF TWO ARRAYS HAVE THE SAME CONTENT
function compareArrays(first, second) {

   // START BY SORTING BOTH
   first = first.sort();
   second = second.sort();

   // ASSIST VARS
   var value = false;
   var num = 0;

   // CHECK IF ARRAYS ARE SAME SIZE
   if (first.length == second.length) {

      // CHECK THAT EACH EACH ELEMENT ARE THE SAME
      for (var x = 0; x < first.length; x++) {
         if (first[x] == second[x]) {

            // IF THEY DO, INCREMENT NUM
            num++;
         }
      }

      // IF NUM EQUALS ARRAY SIZE, RETURN TRUE
      if (num == first.length) {
         value = true;
      }
   }

   return value;
}

// SELECTOR CSS OPACITY TRANSITION
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

// GENERATE UNIX TIMESTAMP
function unixTime() {
   var time = Math.round(+new Date()/1000);
   return time;
}