var Mutable = require('./mutable.js')
var moment = require('moment');

class Tracker {

   // FETCH IPFS CONTENT 
   init() {
      var mutable = new Mutable();
      
      var p = mutable.read('tracker.json').then((content) => {
         return content;
      });

      return p;
   }

   // RENDER BODY
   body(filter = '') {
      this.init().then((content) => {

         // PARSE OBJECT & FETCH KEYS
         content = JSON.parse(content);
         var keys = Object.keys(content);

         // REVERSE TO GET NEWEST FIRST
         keys.reverse();

         // HELP VARS
         var fileName = '';
         var fileData = {};
         var subKeys = [];
         var blobHolder = '';

         // LOOP THROUGH FILES WITH SUBMISSIONS
         for (var x = 0; x < keys.length; x++) {
            fileName = keys[x];
            fileData = content[fileName];
            subKeys = Object.keys(fileData);

            // REVERSE TO GET NEWEST FIRST
            subKeys.reverse();

            // HELP VARS
            var user = '';
            var hash = '';
            var timestamp = 0;

            // STRUCTURE VARS
            var wrap = '';
            var table = '';
            var header = '';
            var rows = '';
            var row = '';

            // GENERATE HEADER
            header = '<tr><td><div id="header">' + fileName + '</div></td></tr>';
            rows += header;

            // LOOP THROUGH SUBMISSIONS
            for (var y = 0; y < subKeys.length; y++) {
               user = subKeys[y];
               hash = fileData[user].hash;
               timestamp = fileData[user].timestamp;

               // GENERATE ROW
               row = `
                  <tr><td>
                     <div id="gray">
                        <table><tbody><tr>
                           <td>Author:</td>
                           <td>` + capitalize(user) + `</td>
                        </tr></tbody></table>
                        <hr>
                        <table><tbody><tr>
                           <td>Hash Location:</td>
                           <td><a href="http://ipfs.io/ipfs/` + hash + `" target="_blank">` + hash + `</a></td>
                        </tr></tbody></table>
                        <hr>
                        <table><tbody><tr>
                           <td>Submitted:</td>
                           <td>` + moment.unix(timestamp).format('D/MM @ HH:mm') + `</td>
                        </tr></tbody></table>
                     </div>
                  </td></tr>
               `;

               // CONCAT ROW TO PARENT
               rows += row;
            }

            // GENERATE ENTIRE STRUCTURE
            table = '<table><tbody>' + rows + '</tbody></table>';
            wrap = '<div id="tracker-outer"><div id="tracker-inner">' + table + '</div></div>';

            // ONLY CONCAT IF QUERY IS EMPTY OR MATCHES FILENAME
            if (filter == '' || filter == fileName) {
               blobHolder += wrap;
            }
         }

         // ADD ERROR MSG IF NOTHING IF FOUND
         if (blobHolder == '') {
            blobHolder = '<div id="tracker-outer"><div id="tracker-inner"><table><tbody><tr><td><div id="header">No entries found.</div></td></tr></tbody></table></div></div>';
         }

         // PARENT CONTENT
         var cont = $('#container').html();

         // CHECK IF CONTENT IS SAME AS BEFORE QUERY - TO STOP FLICKERING
         if (blobHolder == cont) {

            // RENDER TO SELECTOR
            $('#container').html(cont);

         // OTHERWISE CHANGE CONTENT & TRANSITION
         } else {

            // FADE IN
            fadeIn('container', blobHolder);
         }
      });
   }
}

// EXPORT CLASS
module.exports = Tracker;