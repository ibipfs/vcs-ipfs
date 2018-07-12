class Render {

   constructor(_hash) {

      // SAVE REQUESTED HASH
      this.hash = _hash;

      // SPLIT PATH
      var pathing = _hash.split('/');

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
         this.dirName = current;
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

         // RENDER SUBDIR HEADER BEFORE CONTENT
         if (this.showBack == true) {
            rows += `
               <tr id="current">
                  <td><div>
                     <table><tr>
                        <td>` + this.dirName + `</td>
                        <td>` + this.hash + `</td>
                     </tr></table>
                  </div></td>
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
            var eventREF = item.path;
            
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
                        <td key="` + eventREF + `">` + item.name + `</td>
                        <td key="` + eventREF + `">` + item.hash + `</td>
                     </tr></table>
                  </div></a></td>
               </tr>
            `;

            // APPEND ROWS
            rows += row;
         });

         // ENABLE BACK BUTTON IF ENABLED
         if (this.showBack == true) {
            var parentHash = this.parent;

            rows += `
               <tr id="back">
                  <td><a id="open"><div key="` + parentHash + `">
                     <table><tr>
                        <td key="` + parentHash + `">Back</td>
                        <td key="` + parentHash + `">` + parentHash + `</td>
                     </tr></table>
                  </div></a></td>
               </tr>
            `;
         }

         // CONSTRUCT FULL TABLE
         var table = '<table>' + rows + '</table>';

         // OPACITY 0
         $("#files").css('opacity', '0');

         sleep(180).then(() => {

            // EMPTY SELECTOR
            $('#files').html('');

            // TURN OPACITY UP
            $("#files").css('opacity', '1');

            // RENDER TO SELECTOR
            $('#files').html(table);
         });

      });
   }

   // RENDER FOOTER
   footer() {
      var link = 'Directory Hash: <a href="https://ipfs.io/ipfs/' + this.hash + '" target="_blank">' + this.hash + '</a>';
      $('#footer').html(link)
   }

}