class Render {

   constructor(_hash) {
      this.hash = _hash;
   }

   // FETCH IPFS CONTENT 
   init() {
      var p = promisify('dir', this.hash).then((files) => {
         return files;
      });

      return p;
   }

   // RENDER BODY
   body() {
      this.init(this.hash).then((content) => {

         // DIRECTORY KEYS
         var keys = Object.keys(content);
         var rows = '';

         // PARENT DIR HASH
         var parent = content["0"].path;
         parent = parent.split('/')
         parent = parent[0];

         var rootz = $('#root').val();

         // BACK BUTTON IF PARENT DIR ISNT ROOT
         if (rootz != parent) {
            rows = `
               <tr id="back">
                  <td><a id="open"><div key="` + parent + `">
                     <table><tr>
                        <td key="` + parent + `">Back</a></td>
                        <td key="` + parent + `">` + parent + `</td>
                     </tr></table>
                  </div></a></td>
               </tr>
            `;
         }

         // LOOP THROUGH ALL
         keys.forEach((key) => {

            // CURRENT ITEM
            var item = content[key];

            // HELP VARS
            var row = '';
            var cssID = 'header';
            var eventID = 'open';
            var eventREF = item.hash;
            
            // CHANGE ROW ID BASED FOR FILES
            if (item.type == 'file') {
               cssID = 'content';
               eventID = 'show';
               eventREF = item.path;
            }

            // CONSTRUCT ROW
            var row = `
               <tr id="` + cssID + `">
                  <td><a id="` + eventID + `"><div key="` + eventREF + `">
                     <table><tr>
                        <td key="` + eventREF + `">` + item.name + `</a></td>
                        <td key="` + eventREF + `">` + item.hash + `</td>
                     </tr></table>
                  </div></a></td>
               </tr>
            `;

            // APPEND ROWS
            rows += row;
         });

         // CONSTRUCT FULL TABLE
         var table = '<table>' + rows + '</table>';

         // RENDER TO SELECTOR
         $('#files').html(table);
      });
   }

   // RENDER FOOTER
   footer() {
      var link = 'Directory Hash: <a href="https://ipfs.io/ipfs/' + this.hash + '" target="_blank">' + this.hash + '</a>';
      $('#footer').html(link)
      $('#root').val(this.hash);
   }

}