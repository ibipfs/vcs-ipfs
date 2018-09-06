class Buttons {

   constructor(cache_name) {

      // CREATE REFVAR
      this.ref = cache_name;

      // FETCH CACHE
      this.cache = localStorage.getItem(cache_name);
   }

   // SAVE BUTTON
   save() {

      // PRIMARY VALUE
      var text = 'Save To Cache';

      // SECONDARY VALUE
      if (this.cache != undefined) { text = 'Overwrite Cache'; }

      // GENERATE & RETURN BUTTON
      var button = '<a id="save"><span id="save-cache" storage="' + this.ref + '">' + text + '</span></a>';
      return button;
   }

   // GENERATE UPLOAD BUTTON
   upload() {
      var button = '<span id="upload">Upload To IPFS</span>';
      return button;
   }

   // GENERATE REMOVE BUTTON
   remove() {
      var button = '<a id="remove"><span id="remove-cache" storage="' + this.ref + '">Remove From Cache</span></a>';
      return button;
   }

   // GENERATE DISCARD BUTTON
   discard() {
      var button = '<span id="discard">Discard & Close</span>';
      return button;
   }

   // PROMPT WINDOWS LEFT BUTTONS
   left() {
      var row = this.save();

      // IF CACHE IS FOUND, ADD BUTTON TO UPLOAD
      if (this.cache != undefined) { row += this.upload(); }

      return row;
   }

   // PROMPT WINDOWS RIGHT BUTTONS
   right() {
      var row = '';

      // IF CACHE IS FOUND, ADD BUTTON TO REMOVE
      if (this.cache != undefined) { row = this.remove(); }

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

   // RENDER CONTAINER FOR BUTTONS TO FRONTEND
   render() {
      return `
         <div id="prompt-tools">
         <table>
            <tr>
               <td id="left">` + this.left() + `</td>
               <td id="right">` + this.right() + `</td>
            </tr>
         </table>
         </div>
      `;
   }

}

module.exports = Buttons;