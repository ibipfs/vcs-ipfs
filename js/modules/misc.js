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

// IDENTIFY FULL LANGUAGE NAME FROM SUFFIX
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

// FORMATS FILE PATH TO LOOK MORE USER FRIENDLY
function formatPath(path) {
   var split = path.split('/');
   split[0] = 'Root';
   
   for (var x = 0; x < split.length; x++) {
      split[x] = capitalize(split[x]);
   }

   var string = split.join(' / ');
   return string;
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