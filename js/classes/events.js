var funcs = require('../classes/event-funcs.js');
var Immutable = require('../classes/immutable.js');
var config = require('../config.js')();

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

   // PARENT   
   var split = path.split('/');
   var filename = split.pop();
   var dir = split.join('/');
   
   // FIGURE OUT FILE TYPE FOR BEAUTIFY PARSING
   var type = filename.split('.');
   type = type.pop();

   // FETCH MODULE
   var immutable = new Immutable();

   // GENERATE PROMISES
   var first = immutable.file(path);
   var second = immutable.dir(dir);

   // WAIT FOR FILE DATA & CONFIG PROMISES TO BE RESOLVED
   Promise.all([first, second, config]).then((values) => {
      
      // ASSIGN RESOLVED VALUES
      var file_content = values[0];
      var file_data = fetch_data(values[1], filename);
      var config = values[2];

      // LOOK FOR LEGIT METAMASK SESSION
      if (config.rights == true) {

         // FETCH CACHE DATA
         var cache_name = config.history.current.name + '-' + file_data.hash + '-' + config.metamask.name;
         var cache = localStorage.getItem(cache_name);

         // IF CACHE EXISTS, USE ITS CONTENT AS FILE CONTENT
         if (cache != null) {
            file_content = cache;
         }
      }

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
                                 <td>Direct Link:</td>
                                 <td><a href="http://ipfs.io/ipfs/` + file_data.hash + `" target="_blank">` + file_data.hash + `</a></td>
                              </tr>
                           </table>

                           <hr>

                           <table>
                              <tr>
                                 <td>Size:</td>
                                 <td>` + file_data.size / 1000 + ` KB</td>
                              </tr>
                           </table>

                        </div>
                     </div>

                     <div id="prompt-inner"></div>
      `;

      // STITCH IN BUTTON ROW IF USER IS LOGGED
      if (config.rights == true) {

         // FETCH BUTTONS MODULE
         var buttons = new Buttons(file_data.hash);

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
      
      // GENERATE EDITOR
      window.editor = monaco.editor.create(document.getElementById('prompt-inner'), {
         value: file_content,
         language: findLang(type),
         minimap: {
            enabled: false
         }
      });

      // SET EDITOR TO READ ONLY IF USER IS NOT SUCCESSFULLY LOGGED IN
      if (config.rights != true) {
         window.editor.readOnly = true
      }

      $("#prompt-space").css('opacity', '1');
   });
});

// OPEN DIRECTORY
$('body').on('click', 'a#open', (target) => {

   // MAKE SHORTHAND
   var target = target.currentTarget;

   // FILE PATH
   var hash = $(target).attr('hash');

   // RENDER NEW CONTENT
   var Sections = require('./sections.js');
   var sections = new Sections();

   sections.files(hash);
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