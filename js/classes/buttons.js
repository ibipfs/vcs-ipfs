class Buttons {

   constructor(_file) {
      this.user = $('#metamask').attr('whois');
      this.file = _file;

      this.ref = _file + '-' + this.user;
      this.cache = localStorage.getItem(this.ref);
   }

   // SAVE BUTTON
   save() {

      // PRIMARY VALUE
      var text = 'Save To Cache';

      // SECONDARY VALUE
      if (this.cache != undefined) {
         text = 'Overwrite Cache';
      }

      var button = '<a id="save"><span id="save-cache" storage="' + this.ref + '">' + text + '</span></a>';
      return button;
   }

   // UPLOAD BUTTON
   upload() {
      var button = '<span id="upload">Upload To IPFS</span>';
      return button;
   }

   // REMOVE BUTTON
   remove() {
      var button = '<a id="remove"><span id="remove-cache" storage="' + this.ref + '">Remove From Cache</span></a>';
      return button;
   }

   // DISCARD BUTTON
   discard() {
      var button = '<span id="discard">Discard & Close</span>';
      return button;
   }

   // PROMPT WINDOWS LEFT BUTTONS
   left() {
      var row = this.save();

      // IF CACHE IS FOUND, ADD BUTTON TO UPLOAD
      if (this.cache != undefined) {
         row += this.upload();
      }

      return row;
   }

   // PROMPT WINDOWS RIGHT BUTTONS
   right() {
      var row = '';

      // IF CACHE IS FOUND, ADD BUTTON TO REMOVE
      if (this.cache != undefined) {
         row = this.remove();
      }

      // CONCAT DISCARD BUTTON AND RETURN
      row += this.discard();
      return row;
   }

   // RECALIBRATE BUTTONS
   recalibrate() {

      // RE-RENDER CONTENT TO SELECTORS
      $('#left').html(this.left());
      $('#right').html(this.right());
   }

}