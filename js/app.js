renderFiles();

function log(stuff) {
   console.log(stuff);
}

// SHOW PROMPT TRIGGER
$('a#show').on('click', () => {

   // PICK UP TARGET HASH
   var path = $(event.target).attr('key');

   // FILE
   var file = $.ajax({
      url: "js/content.json",
      async: false,
      dataType: 'json'
   }).responseJSON;

   var instanceData = fetchData(path, file);

   // TRANSFORM OBJECT
   var stringify = JSON.stringify(file);
   var minify = vkbeautify.jsonmin(stringify);
   var beautify = vkbeautify.json(minify, 4);

   // GENERATE TABLE
   var selector = `
      <table id="prompt">
         <tr>
            <td>
               <div id="prompt-outer">
                  <div id="prompt-header">
                     <div id="item">
                        <table>
                           <tr>
                              <td>Name/Path: </td>
                              <td>` + instanceData.path + `</td>
                           </tr>
                        </table>
                        <hr>
                        <table>
                           <tr>
                              <td>Direct Link: </td>
                              <td>` + instanceData.hash + `</td>
                           </tr>
                        </table>
                        <hr>
                        <table>
                           <tr>
                              <td>Size: </td>
                              <td>` + instanceData.size + `</td>
                           </tr>
                        </table>
                     </div>
                  </div>

                  <div id="prompt-inner">
                     <pre><code class="JSON">` + beautify + `</code></pre>
                  </div>

                  <div id="prompt-tools">
                     <table>
                        <tr>
                           <td><span id="save">Save</span><span id="upload">Upload</span></td>
                           <td><a id="asa"><span id="discard">Discard</span></a></td>
                        </tr>
                     </table>
                  </div>
               </div>
            </td>
         </tr>
      </table>
   `;

   // PREPEND TO BODY
   $('body').prepend(selector);

   // CODE HIGHLIGHTING
   $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
   });

   // DISPLAY WITH CSS
   $("#prompt").css('display', 'table');
});

// HIDE PROMPT ON ESC
jQuery(document).on('keyup',function(evt) {

   // ESC KEY
   if (evt.keyCode == 27) {
      closePrompt();
   }

});

// RENDER FILES
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
      var header = '<table><tr id="header"><td><div>' + dir_name +  '</div></td></tr>';
      var footer = '</table>';

      // FILE KEYS
      var files = Object.keys(dir_content);
      var rows = '';

      // LOOP THROUGH FILES
      for (var y = 0; y < files.length; y++) {
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
}

// HASH BASED ON JSON CONTENT
function contentHash(obj) {
   var string = JSON.stringify(obj);
   var string = vkbeautify.jsonmin(string);
   var string = md5(string);

   return string;
}

function fetchData(path, object) {
   path = path.split('/');
   var pathLen = path.length;
   var content;

   switch (pathLen) {
      case 1:
         content = object[path[0]];
      break;

      case 2:
         content = object[path[0]][path[1]];
      break;

      case 3:
         content = object[path[0]][path[1]][path[2]];
      break;
   }

   return content;
}

// CLOSE PROMPT WINDOW
function closePrompt() {

   // CHECK CURRENT DISPLAY VALUE
   var value = $("#prompt").css('display');

   if (value == 'table') {

      // CSS HIDE SELECTOR
      $("#prompt").css('display', 'none');

      // REMOVE FROM DOM
      $('#prompt').remove();
   }
}

web3.eth.getAccounts(function(err, accounts){
   if (err) {
      log("An error occurred: " + err)

   } else {
      log(accounts);
   }
});