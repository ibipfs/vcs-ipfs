// PARSE DIRECTORY
function parseDir(_hash) {
   var build = {};

   // RENDER DIRECTORY LINK IN FOOTER
   var link = 'Directory Hash: <a href="https://ipfs.io/ipfs/' + _hash + '" target="_blank">' + _hash + '</a>';
   $('#footer').html(link)

   // STAGE 1 -- ADD DIRECTORIES TO OBJECT
   promisify('dir', _hash).then((files) => {
      files.forEach((file) => {

         // PUSH DIRECTORIES INTO OBJECT
         var parent = file.name;
         build[parent] = {
            hash: file.hash
         };

      });

   // STAGE 2 -- ADD FILES
   }).then(() => {

      // OBJECT KEYS
      var keys = Object.keys(build);

      // LOOP
      keys.forEach((key) => {
         
         // CHILD DIR PROMISE
         promisify('dir', build[key].hash).then((files) => {
            files.forEach((file) => {

               // FETCH FILE SUFFIX
               var split = file.name.split('.');

               // PUSH FILES INTO OBJECT
               build[key][file.name] = {
                  name: file.name,
                  hash: file.hash,
                  size: file.size,
                  path: key + '/' + file.name,
                  suffix: split.pop()
               }

            });

         // STAGE 3 -- RENDER
         }).then(() => {

            //var content = build;
            localStorage.setItem('dataset', JSON.stringify(build));
            var content = JSON.parse(localStorage.getItem('dataset'));

            //log(content['build']['Main.json'])

            // DIRECTORY KEYS
            var directories = Object.keys(content);
            var links = '';

            // LOOP THROUGH DIRECTORY LIST
            for (var x = 0; x < directories.length; x++) {
               var dir_name = directories[x];
               var dir_content = content[directories[x]];

               // TABLE ELEMENTS
               var header = '<table><tr id="header"><td><div>' + dir_name +  '</div></td></tr>';
               var footer = '</table>';

               // FILE KEYS
               var files = Object.keys(dir_content);
               var rows = '';

               // LOOP THROUGH FILES -- START FROM INDEX 1 TO DODGE THE DIRECTORY HASH
               for (var y = 1; y < files.length; y++) {
                  var file = files[y];
                  var base = dir_content[file];

                  // GENERATE ROW
                  var row = `
                     <tr id="content">
                        <td><a id="show"><div key="` + base.path + `">
                           <table><tr>
                              <td key="` + base.path + `">` + base.name + `</a></td>
                              <td key="` + base.path + `">` + base.hash + `</td>
                           </tr></table>
                        </div></a></td>
                     </tr>
                  `;

                  // APPEND PARENT
                  rows += row;
               }

               // GENERATE FULL TABLE AND APPEND PARENT
               var table = header + rows + footer;
               links += table;
            }

            // RENDER TO SELECTOR
            $('#files').html(links);

         });
      });

   });
}

// FETCH DATA
function fetchData(path) {
   var object = JSON.parse(localStorage.getItem('dataset'));

   path = path.split('/');
   var data = object[path[0]][path[1]]

   return data;
}

/////////////////////////////////////////////

init() {
   
   var build = {};

   // PHASE 1 -- PARSE DIRECTORIES
   var p = promisify('dir', this.hash).then((files) => {
      files.forEach((file) => {

         // PUSH DIRECTORIES INTO OBJECT
         var parent = file.name;
         build[parent] = {
            hash: file.hash
         };

      });

   // PHASE 3 -- RETURN COMPLETED OBJECT
   }).then(() => {
      return new parseDir(this.hash, build);
   });

   return p;
}