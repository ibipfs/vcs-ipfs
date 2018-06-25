renderFiles();

function renderFiles() {

   // CONTENT OBJECT
   var content = $.ajax({
      url: "js/content.json",
      async: false,
      dataType: 'json'
   }).responseJSON;

   // DIRECTORY KEYS
   var directories = Object.keys(content);
   var links = '';

   // LOOP THROUGH DIRECTORY LIST
   for (var x = 0; x < directories.length; x++) {
      var dir_name = directories[x];
      var dir_content = content[directories[x]];

      // TABLE ELEMENTS
      var header = '<table><tr id="header"><td>' + dir_name +  '</td></tr>';
      var footer = '</table>';

      // FILE KEYS
      var files = Object.keys(dir_content);
      var rows = '';

      // LOOP THROUGH FILES
      for (var y = 0; y < files.length; y++) {
         var file = files[y];
         var base = dir_content[file];

         // GENERATE ROW AND APPEND PARENT
         var row = '<tr id="content"><td><a href="https://ipfs.io/ipfs/' + base.hash + '"><div>' + base.name + '</div></a></td></tr>';
         rows += row;
      }

      // GENERATE TABLE AND APPEND PARENT
      var table = header + rows + footer;
      links += table;
   }

   // RENDER TO SELECTOR
   $('#files').html(links);
}

function log(stuff) {
   console.log(stuff);
}