class Files {

   constructor(_hash) {

      // SAVE REQUESTED HASH
      this.hash = _hash;

      // SPLIT PATH
      var pathing = _hash.split('/');

      // SET DEFAULT DIRNAME
      this.dirName = 'Root';

      // IF NOT IN ROOT DIRECTORY
      if (pathing.length > 1) {
         
         // SEPARATE NAME OF CURRENT DIRECTORY
         var current = pathing.pop();

         // SUBTRACT FROM PATH
         var countLast = current.length + 1;
         var good = _hash.length - countLast;
         
         // SAVE PARENT DIR & CURRENT DIR NAME & ENABLE BACK BUTTON
         this.showBack = true;
         this.parent = _hash.substring(0, good);
         this.dirName = formatPath(this.hash);
      }
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

         // ADD DIRECTORY NAME ON TOP
         rows += `
            <tr id="current">
               <td><div>
                  <table><tr>
                     <td id="location">` + this.dirName + `</td>
                  </tr></table>
               </div></td>
            </tr>
         `;

         // HELP VARS
         var row = '';

         // LOOP IN DIRECTORIES FIRST
         keys.forEach((key) => {

            // CURRENT ITEM
            var item = content[key];

            // IF TYPE IS DIR
            if (item.type == 'dir') {

               // CONSTRUCT ROW
               row = `
                  <tr id="header">
                     <td><a id="open" hash="` + item.path + `"><div>
                        <table><tr>
                           <td>` + capitalize(item.name) + `/</td>
                           <td>` + item.hash + `</td>
                        </tr></table>
                     </div></a></td>
                  </tr>
               `;

               // APPEND ROWS
               rows += row;
            }
         });

         // THEN LOOP IN FILES LAST
         keys.forEach((key) => {

            // CURRENT ITEM
            var item = content[key];

            // IF TYPE IS FILE
            if (item.type == 'file') {

               // HELP VARS
               row = '';

               // CONSTRUCT ROW
               var row = `
                  <tr id="content">
                     <td><a id="show" hash="` + item.path + `"><div>
                        <table><tr>
                           <td>` + capitalize(item.name) + `</td>
                           <td>` + item.hash + `</td>
                        </tr></table>
                     </div></a></td>
                  </tr>
               `;

               // APPEND ROWS
               rows += row;
            }
         });

         // ENABLE BACK BUTTON IF TRUE
         if (this.showBack == true) {
            rows += `
               <tr id="back">
                  <td><a id="open" hash="` + this.parent + `"><div>
                     <table><tr>
                        <td>Back</td>
                     </tr></table>
                  </div></a></td>
               </tr>
            `;
         }

         // CONSTRUCT FULL TABLE
         var table = '<table>' + rows + '</table>';

         // FADE IN
         fadeIn('files', table);
      });
   }

   // RENDER FOOTER
   footer() {
      var link = 'Root: <a href="https://ipfs.io/ipfs/' + this.hash + '" target="_blank">' + this.hash + '</a>';
      
      // FADE IN
      fadeIn('footer', link);
   }

}