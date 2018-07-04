ipfs swarm peers
ipfs add datboi.json
echo "Directory Hash?"
read hash
echo "Publishing....."
ipfs name publish $hash
