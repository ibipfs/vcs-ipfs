ipfs swarm peers
ipfs add -r data
echo "Directory Hash?"
read hash
echo "Publishing....."
ipfs name publish $hash
