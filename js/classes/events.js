var funcs = require('../classes/event-funcs.js');
var Mutable = require('../classes/mutable.js');

// HIDE PROMPT ON ESC
$(document).on('keyup',function(evt) {
   
   // ESC KEY
   if (evt.keyCode == 27) {
      event.preventDefault();
      funcs.closePrompt();
   }

});

// HIDE PRObuttonsMPT WITH DISCARD BUTTON
$('body').on('click', '#discard', () => {
   funcs.closePrompt();
});

// CTRL + X KEYBINDS
$(window).bind('keydown', function(event) {
   if (event.ctrlKey || event.metaKey) {
      switch (String.fromCharCode(event.which).toLowerCase()) {

         // CTRL + S
         case 's':
            event.preventDefault();
            funcs.saveCache();
         break;

         // CTRL + X
         case 'x':
            event.preventDefault();
            funcs.removeCache();
         break;
      }
   }
});

// SHOW FILE
$('body').on('click', 'a#show', (target) => {

   // MAKE SHORTHAND
   var target = target.currentTarget;
   
   // FILE PATH
   var path = $(target).attr('hash');

   // REFS
   var split = path.split('/');
   var file = split.pop();
   var dir = split.join('/');
   
   // FETCH MUTABLE MODULE
   var mutable = new Mutable();

   // GENERATE PROMISES
   var first = promisify('file', path);
   var second = promisify('dir', dir);
   var third = mutable.read('tracker.json');

   // AFTER BOTH PROMISES ARE RESOLVED
   Promise.all([first, second, third]).then(function(values) {

      // PARSE TRACKER
      var tracker = JSON.parse(values[2]);

      // IS SOMEONE LOGGED INTO METAMASK
      var whois = $('#metamask').attr('whois');

      // FILE INFO
      var info = fetchData(values[1], file);
      var content = '';

      promisify('file', info.hash).then((tracker_content) => {

         // POTENTIAL CACHE NAME
         var cacheName = info.hash + '-' + whois;
         
         // IF CACHED VERSION DOES NOT EXIST
         if (localStorage.getItem(cacheName) == undefined) {

            // POTENTIAL TRACKER DATA
            var check = tracker[info.hash];

            if (check != undefined) {
               check = check[whois];
            }

            // IF TRACKER HAS NO RELEVANT ENTRIES
            if (check == undefined) {

               // FALLBACK TO DEFAULT FILE CONTENT
               log('From File!');
               content = values[0].toString('utf8');
               
            // IF UPLOAD IS FOUND IN TRACKER
            } else {

               log('From Tracker!');
               content = tracker_content;
            }

         // IF CACHE EXISTS, USE IT
         } else {

            log('From Cache!');
            content = localStorage.getItem(cacheName);
         }

         // FIGURE OUT FILE TYPE
         var type = info.name.split('.');
         type = type[type.length - 1];

         // FORMAT PATH TO BE MORE AESTHETIC
         var location = info.path.split('/');
         location[0] = 'root';
         location = location.join('/');
         location = headerify(location);

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
                                    <td>Name/Path:</td>
                                    <td id="path">` + location + `</td>
                                 </tr>
                              </table>

                              <hr>

                              <table>
                                 <tr>
                                    <td>Direct Link:</td>
                                    <td><a href="http://ipfs.io/ipfs/` + info.hash + `" target="_blank">` + info.hash + `</a></td>
                                 </tr>
                              </table>

                              <hr>

                              <table>
                                 <tr>
                                    <td>Size:</td>
                                    <td>` + info.size / 1000 + ` KB</td>
                                 </tr>
                              </table>

                           </div>
                        </div>

                        <div id="prompt-inner"></div>
         `;

         // STITCH IN BUTTON ROW IF USER IS LOGGED
         if (metamask.isLogged) {

            // FETCH BUTTONS MODULE
            var buttons = new Buttons(info.hash);

            // RENDER BUTTON ROW
            selector += buttons.render();
         }

         // STITCH IN END OF SELECTORS
         selector += `
                     </div>
                  </td>
               </tr>
            </table>
         `;

         // PREPEND TO BODY
         $('#prompt-space').prepend(selector);

         // FETCH MONACO EDITOR MODULE
         var monaco = require('@timkendrick/monaco-editor');
         
         // CHECK IF READ ONLY NEEDS TO BE SET
         if (metamask.isLogged) {

            window.editor = monaco.editor.create(document.getElementById('prompt-inner'), {
               value: beautify(content, type),
               language: findLang(type),
               minimap: {
                  enabled: false
               }
            });

         } else {
         
            window.editor = monaco.editor.create(document.getElementById('prompt-inner'), {
               value: beautify(content, type),
               language: findLang(type),
               minimap: {
                  enabled: false
               },
               readOnly: true
            });

         }

         $("#prompt-space").css('opacity', '1');
      });
   });
});

// OPEN DIRECTORY
$('body').on('click', 'a#open', (target) => {

   // MAKE SHORTHAND
   var target = target.currentTarget;

   // FILE PATH
   var hash = $(target).attr('hash');

   // RENDER NEW CONTENT
   var files = new Files(hash);
   files.body();
});

// SAVE FILE RENDITION TO CACHE
$('body').on('click', '#save', () => {
   funcs.saveCache();
});

// REMOVE CACHED FILE
$('body').on('click', '#remove', () => {
   funcs.removeCache();
});

// UPLOAD VIRTUAL FILE TO IPFS
$('body').on('click', '#upload', () => {
   funcs.upload();
});

// ONCLICK FILE
$('body').on('click', 'a#compare', (target) => {

   // MAKE SHORTHAND
   var target = target.currentTarget;
   
   // FETCH RELEVANT HASHES
   var original = $(target).attr('old');
   var edited = $(target).attr('new');
   var author = $(target).attr('author');
   var path = $(target).attr('path');
   var time = $(target).attr('time');

   // GENERATE PROMISES
   var first = promisify('file', original);
   var second = promisify('file', edited);

   // WAIT FOR BOTH PROMISES TO BE RESOLVED
   Promise.all([first, second]).then(function(values) {

      // SAVE FETCHES FILE VALUES
      var original_value = values[0];
      var edited_value = values[1];

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
                                 <td>Name/Path:</td>
                                 <td id="path">` + headerify(path) + `</td>
                              </tr>
                           </table>

                           <hr>

                           <table>
                              <tr>
                                 <td>Original:</td>
                                 <td><a href="http://ipfs.io/ipfs/` + original + `" target="_blank">` + original + `</a></td>
                              </tr>
                           </table>

                           <hr>

                           <table>
                              <tr>
                                 <td>Modified:</td>
                                 <td><a href="http://ipfs.io/ipfs/` + edited + `" target="_blank">` + edited + `</a></td>
                              </tr>
                           </table>

                           <hr>

                           <table>
                              <tr>
                                 <td>Author:</td>
                                 <td>` + capitalize(author) + `</td>
                              </tr>
                           </table>

                           <hr>

                           <table>
                              <tr>
                                 <td>Submitted:</td>
                                 <td>` + time + `</td>
                              </tr>
                           </table>

                        </div>
                     </div>

                     <div id="prompt-inner"></div>
                  </div>
               </td>
            </tr>
         </table>
      `;

      // PREPEND TO BODY
      $('#prompt-space').prepend(selector);

      // EXPAND WINDOW SIZE
      //$('#prompt-outer').css('width', '1200px');

      // FETCH MONACO EDITOR MODULE
      var monaco = require('@timkendrick/monaco-editor');

      var originalModel = monaco.editor.createModel(original_value, 'javascript');
      var modifiedModel = monaco.editor.createModel(edited_value, 'javascript');
      
      var diffEditor = monaco.editor.createDiffEditor(document.getElementById("prompt-inner"), {readOnly: true});

      diffEditor.setModel({
         original: originalModel,
         modified: modifiedModel
      });

      // TURN ON OPACITY
      $("#prompt-space").css('opacity', '1');
   });
});