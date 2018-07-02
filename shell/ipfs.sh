ipfs swarm peers
ipfs add -r .
echo "Directory Hash?"
read hash
echo "Publishing....."
ipfs name publish $hash
