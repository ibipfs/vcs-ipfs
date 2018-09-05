function render(config) {
   elements();
   content(config);
   events(config);
}

// ADD HTML CONTENT
function elements() {

   // GENERATE PARENT SELECTORS
   var filter = '<div id="filter-outer"><div id="filter-inner"><input type="text" id="filter" placeholder="Filter by Username, File Name or File Hash" tabindex="1"></div></div>';
   var files = '<div id="files-outer"><div id="activity"></div></div>';

   // RENDER THEM IN
   $('#content-body').html(filter + files);
}

// ADD GENERATED CONTENT
function content(config, filter = '') {
         
   // FETCH KEYS & REVERSE ORDER
   var keys = Object.keys(config.activity);
   keys.reverse();

   // ALL ENTRY ROWS
   var rows = '';

   // FETCH MOMENT MODULE
   var moment = require('moment');

   // GENERATE ROW FOR EACH ENTRY
   keys.forEach((entry) => {
      var instance = config.activity[entry];
      var timestamp = moment.unix(entry).format('D/MM @ HH:mm');

      // LIMIT SPLITTING TO ONLY UPLOADS
      if (instance.type == 'upload') {

         var filename = instance.path.split('/').pop();

         // CHANGE FIRST KEY IN PATH TO ROOT DIR
         instance.path = instance.path.split(' / ');
         instance.path[0] = config.latest.hash;
         instance.path = instance.path.join('/');
      }

      // CHECK FILTER
      if (filter == '' || filter.toLowerCase() == instance.user.toLowerCase() || filter == instance.original || filter == instance.path || filter.toLowerCase() == filename.toLowerCase()) {
         
         // ENTRY STRING
         var string = '';

         // GENERATE STRING BASED ON ENTRY TYPE
         switch (instance.type) {

            // UPLOAD
            case 'upload':
               string = capitalize(instance.user) + ' uploaded an entry of <a id="compare" old="' + instance.original + '" new="' + instance.hash + '" author="' + instance.user + '" path="' + instance.path + '" time="' + timestamp + '">' + headerify(instance.path, true) + '</a>';
            break;

            // RELEASE
            case 'release':
               string = 'Version <a href="http://ipfs.io/ipfs/' + instance.hash + '">' + instance.name + '</a> has been released!';
            break;

            // FALLBACK
            default:
               string = 'Instance type not found.';
            break;

         }

         // GENERATE ROW
         var row = `
            <tr><td><div>
               <table><tbody><tr>
                  <td>` + string + `</td>
                  <td>` + timestamp + `</td>
               </tr></tbody></table>
            </div></td></tr>
         `;

         // CONCAT TO ROWS
         rows += row;
      }
   });

   // IF LOG IS EMPTY OR FILTER RETURNS NOTHING
   if (rows == '') {
      rows = '<tr><td><div>No entries found.</div></td></tr>';
   }

   // GENERATE TABLE & STITCH ROWS IN
   var table = '<table><tbody>' + rows + '</tbody></table>';

   // FETCH SELECTOR CONTENT BEFORE RE-RENDER
   var previous = $('#activity').html();

   // IF OLD AND NEW SELECTOR CONTENT ARE THE SAME, DO NOTHING --- DO THIS TO STOP UNECESSARY FLICKERING
   if (table == previous) {

      $('#activity').html(table);

   // OTHERWISE FADE IN NEW CONTENT
   } else {
      
      fadeIn('activity', table);
   }
}

// ADD SPECIFIC EVENTS
function events(config) {

   // FETCH & INSTANTIATE ACTIONS MODULE
   var actions = require('../modules/actions.js');

   // FILTER
   $("#filter").on('keyup', () => { var query = $('#filter').val(); content(config, query); });

   // COMPARE FILES EVENT
   $('body').on('click', 'a#compare', (target) => { actions.compare(target.currentTarget); });

   // CLOSE WINDOW EVENT
   $(document).on('keyup', (evt) => {
   
      // ESC KEY
      if (evt.keyCode == 27) {
         event.preventDefault();
         actions.close();
      }
   });

}

// EXPORT RENDER FUNCTION AS MODULE
module.exports = render;