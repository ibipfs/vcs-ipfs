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
         var instanceData = {};
         var subKeys = [];

         var foofoo = '';

         // ANALYZE FILE
         for (var x = 0; x < keys.length; x++) {
            fileName = keys[x];
            instanceData = content[fileName];
            subKeys = Object.keys(instanceData);

            // REVERSE TO GET NEWEST FIRST
            subKeys.reverse();

            // HELP VARS
            var user = '';
            var hash = '';
            var timestamp = 0;
            var targetData = {};

            // STRUCTURE VARS
            var wrap = '';
            var table = '';
            var header = '';
            var rows = '';
            var row = '';

            // GENERATE HEADER
            header = '<tr><td><div id="header">' + fileName + '</div></td></tr>';
            rows += header;

            // ANALYZE CONTRIBUTORS
            for (var y = 0; y < subKeys.length; y++) {
               user = subKeys[y];
               targetData = instanceData[user];

               hash = targetData.hash;
               timestamp = targetData.timestamp;

               // GENERATE ROW & CONCAT
               row = `
                  <tr><td>
                     <div id="gray">
                        <table><tr>
                           <td>Author:</td>
                           <td>` + capitalize(user) + `</td>
                        </tr></table>
                        <hr>
                        <table><tr>
                           <td>Hash Location:</td>
                           <td><a href="http://ipfs.io/ipfs/` + hash + `" target="_blank">` + hash + `</a></td>
                        </tr></table>
                        <hr>
                        <table><tr>
                           <td>Submission Time:</td>
                           <td>` + moment.unix(timestamp).format('D/MM @ HH:mm') + `</td>
                        </tr></table>
                     </div>
                  </td></tr>
               `;

               // CONCAT TO PARENT
               rows += row;

               // BUILD STRUCTURE
               table = '<table>' + rows + '</table>';
               wrap = '<div id="tracker-outer"><div id="tracker-inner">' + table + '</div></div>';
               foofoo += wrap;
            }

            // RENDER TO SELECTOR
            $('#container').html(foofoo);

            sleep(180).then(() => {

               // TURN OPACITY UP
               $("#container").css('opacity', '1');
            });
         }
      });
   }
}

// EXPORT CLASS
module.exports = Tracker;