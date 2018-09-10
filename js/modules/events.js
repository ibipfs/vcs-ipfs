function events(config) {

   // FETCH ACTIONS MODULE
   var actions = require('./actions.js');

   // SHOW FILE EVENT
   $('body').on('click', 'a#show', (target) => { actions.show(config, target.currentTarget); });

   // COMPARE FILES EVENT
   $('body').on('click', 'a#compare', (target) => { actions.compare(target.currentTarget); });

   // OPEN IPFS DIRECTORY EVENT
   $('body').on('click', 'a#open', (target) => { require('../sections/index.js').content(config, $(target.currentTarget).attr('hash')); });

   // SAVE BUTTON EVENT
   $('body').on('click', '#save', () => { actions.save(window.editor.getValue(), config.metamask.name); });

   // REMOVE BUTTON EVENT
   $('body').on('click', '#remove', () => { actions.remove(config.metamask.name); });

   // UPLOAD BUTTON EVENT
   $('body').on('click', '#upload', () => { actions.upload(); });

   // CLOSE WINDOW VIA BUTTON EVENT
   $('body').on('click', '#discard', () => { actions.close(); });

   // CLOSE WINDOW VIA "ESC" KEY EVENT
   $(document).on('keyup', (evt) => { if (evt.keyCode == 27) { event.preventDefault(); actions.close(); } });
   
   // CHANGE SELECTED EVENT IN TRACKER
   $('body').on('change', '#tracker-select', (target) => {

      // PICK UP RELEVANT INFO
      var instance = $(target.currentTarget).attr('instance');
      var user = $(target.currentTarget).val();

      // EXECUTE
      actions.change_selected(instance, user);
   });

   // RELEASE EVENT
   $('input#release').on('click', () => {

      // PICK UP USER SELECTED SIGNIFICANCE
      var significance = $("#significance :selected").text();

      // EXECUTE
      actions.release(significance);
   });
   
   // ADD TO WHITELIST EVENT
   $('input#whitelist').on('click', () => {

      // PICK UP INPUT VALUES
      var name = $('#add-name').val();
      var permission = $("#add-permission :selected").text();
      var address = $('#add-address').val();

      // EXECUTE
      actions.add(name, permission, address);
   });

   $('input#change').on('click', () => {

      // PICK UP INPUT VALUES
      var permission = $("#change-permission :selected").text();
      var address = $('#change-address').val();

      // EXECUTE
      actions.change_permission(address, permission);
   });
}

// EXPORT ALL EVENTS AS A SINGLE MODULE
module.exports = events;