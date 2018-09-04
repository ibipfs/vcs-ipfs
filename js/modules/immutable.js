// OPEN DIRECTORY
function dir (value) { return ipfs.ls(value); }

// FETCH RAW FILE CONTENT
function raw (value) { return ipfs.files.cat(value); }

// FETCH STRINGIFIED FILE CONTENT
function file (value) { return ipfs.files.cat(value.toString('utf8')); }

// INSPECT FILE OR DIR PROPERTIES
function get (value) { return ipfs.files.get(value); }

// ADD FILE TO IPFS
function add_file (content) { return ipfs.files.add(Buffer.from(content)); }

// ADD DIRECTORY TO IPFS
function add_dir (fileArray) { return ipfs.files.add(fileArray); }

// EXPORT INDIVIDUAL FUNCTIONS AS MODULES
module.exports = {
   dir: dir,
   raw: raw,
   file: file,
   get: get,
   add_file: add_file,
   add_dir: add_dir
}