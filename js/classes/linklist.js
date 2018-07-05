class LinkList {
 
   // CONSTRUCT DIR PROPERTIES
   constructor (_hash, buildObj) {
      this.hash = _hash;
      this.build = buildObj;
   }
 
   // INIT PROMISE
   init() {
      var build = {};
 
      var p = promisify('dir', this.hash).then((files) => {
         files.forEach((file) => {
 
            // PUSH DIRECTORIES INTO OBJECT
            var parent = file.name;
            build[parent] = {
               hash: file.hash
            };
 
         });
 
         return new LinkList(this.hash, build);
      });

      return p;
   }

   // RENDER METHOD
   render() {
      this.init().then((dir) => {
         log(dir.build);
      });
   }
}
