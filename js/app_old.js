// UNCOMMENT IPFS LIBRARY @INDEX

const ipfs = new Ipfs({
   config: {
      Addresses: {
         Swarm: ['/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star/ipfs/QmV7KjoDfJVtqojfM3CqrDV6ifq1wbfk6qEuhyiHSYAMCd']
      }
   }
});

ipfs.on('ready', () => {
   log('Connected!')

   const validCID = 'QmaJysin1GznfoyqFF9cvoDCWeEGvPSeMVZdbxXChojJ4p';
   $('body').html('<a href="https://ipfs.io/ipfs/' + validCID + '">' + validCID + '</a>')

   const stream = ipfs.lsReadableStream(validCID)

   stream.on('data', (file) => {
   // write the file's path and contents to standard out
   console.log(file.path)
   })
});

function log(stuff) {
   console.log(stuff);
}