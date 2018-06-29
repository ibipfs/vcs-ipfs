pragma solidity ^0.4.2;

contract Main {

    // MEMBERS
    mapping(uint256 => User) public members;
    uint256 public memberCount;

    // CONTRACT ADMIN
    address public admin = 0x2b1ccbb47df9585e513cecac307a1e8ce0b620c5;

    // USER OBJECT
    struct User {
        string name;
        address owner;
        uint256 timestamp;
    }

    // ADD MEMBER
    function add(string _name, address _owner) public {

        // MAKE SURE CALLER ADDRESS IS ADMIN
        if (msg.sender == admin) {

            // GENERATE STRUCT
            members[memberCount].name = _name;
            members[memberCount].owner = _owner;
            members[memberCount].timestamp = now;

            // INCREMENT
            memberCount++;
        }
    }
}