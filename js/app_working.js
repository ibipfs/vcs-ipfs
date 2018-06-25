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

   const validCID = 'QmQZjuhxyjmVPxFkPi9F3mU2VNs3qCGNBhuFkQteKDkSWa';
   $('body').html('<a href="https://ipfs.io/ipfs/' + validCID + '">' + validCID + '</a>')

   // ipfs.ls(validCID, function (err, files) {
   //    log(files);
   //    files.forEach((file) => {
   //       console.log(file.path)
   //    })
   // })

   ipfs.files.cat(validCID, function (err, file) {
      if (err) {
        throw err
      }
    
      console.log(file.toString('utf8'))
    })
});

function log(stuff) {
   console.log(stuff);
}