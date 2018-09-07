function events(config) {

   // FETCH & INSTANTIATE ACTIONS MODULE
   var actions = require('../modules/actions.js');

   // FILES

      // SHOW FILE CONTENT
      $('body').on('click', 'a#show', (target) => { actions.show(config, target.currentTarget); });

      // OPEN IPFS DIRECTORY
      $('body').on('click', 'a#open', (target) => { content(config, $(target.currentTarget).attr('hash')); });

      // SAVE BUTTON EVENT
      $('body').on('click', '#save', () => { actions.save(window.editor.getValue(), config.metamask.name); log('called event') });

      // REMOVE BUTTON EVENT
      $('body').on('click', '#remove', () => { actions.remove(config.metamask.name); });

      // UPLOAD BUTTON EVENT
      $('body').on('click', '#upload', () => { actions.upload(); });

      // CLOSE WINDOW VIA BUTTON EVENT
      $('body').on('click', '#discard', () => { actions.close(); });

      // CLOSE WINDOW EVENT
      $(document).on('keyup', (evt) => {
      
         // ESC KEY
         if (evt.keyCode == 27) {
            event.preventDefault();
            actions.close();
         }
      });

   // ACTIVITY

      // FILTER
      $("#filter").on('keyup', () => { var query = $('#filter').val(); content(config, query); });

      // COMPARE FILES EVENT
      $('body').on('click', 'a#compare', (target) => { actions.compare(target.currentTarget); });
   
      // CLOSE WINDOW EVENT
      $(document).on('keyup', (evt) => {
      
         // ESC KEY
         if (evt.keyCode == 27) {
            event.preventDefault();
            actions.close();
         }
      });

   // TRACKER

      // FILTER EVENT
      $("#filter").on('keyup', () => { var query = $('#filter').val(); content(config, query); });

      // COMPARE FILES EVENT
      $('body').on('click', 'a#compare', (target) => { actions.compare(target.currentTarget); });
   
      // CLOSE WINDOW EVENT
      $(document).on('keyup', (evt) => {
         
         // ESC KEY
         if (evt.keyCode == 27) {
            event.preventDefault();
            actions.close();
         }
   
      });
   
      // WHEN INSTANCE USER SELECTION DROPDOWN OPTION CHANGES
      $('body').on('change', '#tracker-select', (target) => {
         log('called event')
   
         target = target.currentTarget;
   
         // PICK UP RELEVANT INFO
         var instance = $(target).attr('instance');
         var user = $(target).val();
   
         // EXECUTE
         actions.change_selected(instance, user);
      });

   // MANAGE

      // RELEASE
      $('#release').on('click', () => {

         // PICK UP USER SELECTED SIGNIFICANCE
         var significance = $("#significance :selected").text();
   
         // EXECUTE
         actions.release(significance);
      });
   
      // WHITELIST
      $('#whitelist').on('click', () => {
   
         // PICK UP INPUT VALUES
         var name = $('#name').val();
         var permission = $("#permission :selected").text();
         var address = $('#address').val();
   
         // EXECUTE
         actions.add(name, permission, address);
      });
   
}

module.exports = events;