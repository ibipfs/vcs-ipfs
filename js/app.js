renderFiles();

function log(stuff) {
   console.log(stuff);
}

// SHOW PROMPT TRIGGER
$('a#show').on('click', () => {
   var name = $(event.target).attr("name");
   //var name = 'testing';

   var selector = `
      <table id="prompt">
         <tr>
            <td>
               <div id="prompt-outer">
                  <div id="prompt-inner">` + name + `</div>
               </div>
            </td>
         </tr>
      </table>
   `;

   $('body').prepend(selector);
   $("#prompt").css('display', 'table');
});

// HIDE PROMPT ON ESC
jQuery(document).on('keyup',function(evt) {
   if (evt.keyCode == 27) {
     var value = $("#prompt").css('display');

     if (value == 'table') {
        $("#prompt").css('display', 'none');
     }
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

         // GENERATE ROW AND APPEND PARENT
         var row = '<tr id="content"><td><div>' + base.name + '</div></td></tr>';

         var row = `
            <tr id="content">
               <td><div>
                  <table><tr>
                     <td>` + base.name + `</a></td>
                     <td><a id="show" attr="view"><span name="` + base.hash + `">View</span></a><a id="show"" attr="edit"><span name="` + base.hash + `" id="edit">Edit</span></a></td>
                  </tr></table>
               </div></td>
            </tr>
         `;

         rows += row;
      }

      // GENERATE TABLE AND APPEND PARENT
      var table = header + rows + footer;
      links += table;
   }

   // RENDER TO SELECTOR
   $('#files').html(links);
}

// HASH BASED ON OBJECT CONTENT
function contentHash(obj) {

   // STRINGIFY
   var string = JSON.stringify(obj);

   // FORCE LOWERCASE
   var string = string.toLowerCase();

   // TRIM SPACES
   var string = string.trim();

   // HASH
   var string = md5(string);

   return string;
}