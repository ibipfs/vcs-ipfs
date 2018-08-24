pragma solidity ^0.4.2;

contract Main {

    // MEMBERS
    mapping(address => User) public memberInfo;
    uint256 public memberCount;

    // CONTRACT ADMIN
    address public admin = 0x2b1ccbb47df9585e513cecac307a1e8ce0b620c5;

    // USER OBJECT
    struct User {
        string name;
        uint256 timestamp;
    }

    // ADD MEMBER
    function add(string _name, address _owner) public returns (string) {

        // MAKE SURE CALLER ADDRESS IS ADMIN
        if (msg.sender == admin) {

            // GENERATE STRUCT
            memberInfo[_owner].name = _name;
            memberInfo[_owner].timestamp = now;

            // INCREMENT MEMBERCOUNT
            memberCount++;
    
            return 'User was successfully added!';

        // ACCESS DENIED
        } else {
            return 'You do not have permission do execute this method!';
        }
    }
}