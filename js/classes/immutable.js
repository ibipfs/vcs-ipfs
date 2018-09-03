class Immutable {

   // OPEN DIRECTORY
   dir (value) { return ipfs.ls(value); }

   // FETCH RAW FILE CONTENT
   raw (value) { return ipfs.files.cat(value); }

   // FETCH STRINGIFIED FILE CONTENT
   file (value) { return ipfs.files.cat(value.toString('utf8')); }

   // INSPECT FILE OR DIR PROPERTIES
   get (value) { return ipfs.files.get(value); }

   // ADD FILE TO IPFS
   add_file (content) { return ipfs.files.add(Buffer.from(content)); }

   // ADD DIRECTORY TO IPFS
   add_dir (fileArray) { return ipfs.files.add(fileArray); }
}

// EXPORT CLASS AS MODULE
module.exports = Immutable;