// MKDIR
function mkdir(dir) {
   ipfs.files.mkdir('/' + dir, (err) => {
      if (err) {
      console.error(err)
      } else {
         log('Added: "' + dir + '"');
      }
   });
}

// LS
function ls(dir = '') {
   ipfs.files.ls(dir, function (err, files) {
      if (err) {
         log(err);
      } else {
         log('Listing Content.');
         log(files);
      }
   });
}

// FLUSH
function flush() {
   ipfs.files.flush('/', (err) => {
      if (err) {
         log(err);
      } else {
         log('Flushed.')
      }
   });
}

// RM
function rm(dir) {
   ipfs.files.rm('/' + dir, { recursive: true }, (err) => {
      if (err) {
         log(err);
      } else {
         log('Removed "' + dir + '"')
      }
   });
}

//mkdir('vcs')