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

   // FILE DETAILS
   var instanceData = fetchData(path, file);

   // TRANSFORM CODE BLOCK
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
                           <td><span id="save-cache">Save To Cache</span><span id="upload">Upload To IPFS</span></td>
                           <td><span id="remove-cache">Remove From Cache</span><span id="discard">Discard & Close</span></td>
                        </tr>
                     </table>
                  </div>

               </div>
            </td>
         </tr>
      </table>
   `;

   // PREPEND TO BODY
   $('#prompt-space').prepend(selector);

   // CODE HIGHLIGHTING
   $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
   });

   $("#prompt-space").css('opacity', '1');
});

// HIDE PROMPT ON ESC
jQuery(document).on('keyup',function(evt) {

   // ESC KEY
   if (evt.keyCode == 27) {
      closePrompt();
   }

});

// HIDE PROMPT WITH DISCARD BUTTON
$('body').on('click', '#discard', () => {
   closePrompt();
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

      // MAKE PARENT OPACITY ZERO AGAIN
      $('#prompt-space').css('opacity', '0');

      // WAIT FOR 0.2 SECONDS
      sleep(180).then(() => {

         // CSS HIDE SELECTOR
         $("#prompt").css('display', 'none');

         // REMOVE FROM DOM
         $('#prompt').remove();
      });
   }
}

// WRAP BLOCKCHAIN QUERIES INTO PROMISES
function promisify(query, value = null) {
   return new Promise(function(resolve, reject) {
 
      switch(query) {
 
         // FETCH NUMBER OF RECORDS
         case 'metamask':
            web3.eth.getAccounts(function(err, result) {
               if (err) {
                  log('MetaMask Error: ' + err)
               } else {
                  resolve(result);
               }
            });
         break;
 
         // FALLBACK
         default:
            log('Error in Promisify Switch.')
         break;
      }
 
   });
}

// CHECK IF USER IS LOGGED IN
promisify('metamask').then((accounts) => {

   // CHECK AMOUNT
   var count = accounts.length;
   log(count + ' account(s) found.');

   // ASSIST VARS
   var text;
   var bg;

   if (count == 1) {
      var user = accounts[0];

      // MEMBERS ARRAY -- REPLACE WITH BLOCKCHAIN VERSION
      var members = ['0xf8ac66155f50a5abd84e663834e2bca064f360c4', '0x2ca50c5fb8d1667189706d589cb554ef882c8eff'];
      
      // CHECK IF MEMBER IS IN ARRAY
      var check = $.inArray(user, members);

      // IF USER IS FOUND
      if (check != -1) {

         // MEMBERSINFO OBJECT -- REPLACE WITH BLOCKCHAIN VERSION
         var memberInfo = {
            "0xf8ac66155f50a5abd84e663834e2bca064f360c4": {
               name: "wickstjo",
               timestamp: 1530321302
            },
            "0x2ca50c5fb8d1667189706d589cb554ef882c8eff": {
               name: "testuser",
               timestamp: 1530324655
            },
         }

         // FETCH CORRESPONDING NAME
         var name = memberInfo[user].name;

         // SET ACCOUNT NAME AS SELECTOR KEY
         $('#metamask').attr('key', name);
         
         text = 'MetaMask Connected - ' + name;
         bg = 'success';

      // IF CONNECTED BUT NOT A MEMBER
      } else {
         text = 'MetaMask Found - Unknown User';
         bg = 'caution';
      }

   // IF METAMASK CANT BE FOUND
   } else {
      text = 'MetaMask Not Found';
      bg = 'error';
   }
   
   // FINALLY RENDER APPROPRIATELY
   $('#metamask').text(text);
   $('#metamask').css('background', "url('interface/img/" + bg + ".png')");
});

// SLEEP FUNC
function sleep (time) {
   return new Promise((resolve) => setTimeout(resolve, time));
 }