function render(config) {
   body();
   content(config);
}

// ADD HTML CONTENT
function body() {

   // GENERATE SELECTOR & RENDER
   var files = '<div id="files-outer"><div id="activity"></div></div>';
   $('#content-body').html(files);
}

// ADD GENERATED CONTENT
function content(config) {
         
   // FETCH KEYS & REVERSE ORDER
   var keys = Object.keys(config.activity).reverse();

   // FETCH MOMENT MODULE IF THERE ARE KEYS
   if (keys.length != 0) { var moment = require('moment'); }

   // ALL ENTRY ROWS
   var rows = '';

   // GENERATE ROW FOR EACH ENTRY
   keys.forEach((entry) => {
      var instance = config.activity[entry];
      var timestamp = moment.unix(entry).format('DD/MM @ HH:mm');

      // LIMIT SPLITTING TO ONLY UPLOADS
      if (instance.type == 'upload') {

         // CHANGE FIRST KEY IN PATH TO ROOT DIR
         instance.path = instance.path.split(' / ');
         instance.path[0] = config.latest.hash;
         instance.path = instance.path.join('/');
      }
         
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
   });

   // FALLBACK IF ACTIVITY LOG IS EMPTY
   if (rows == '') { rows = '<tr><td><div>No entries found.</div></td></tr>'; }

   // GENERATE TABLE & STITCH ROWS IN
   var table = '<table>' + rows + '</table>';
   fadeIn('activity', table);
}

// EXPORT RENDER AND CONTENT FUNCTIONS AS MODULES
module.exports = {
   render: render,
   content: content
}