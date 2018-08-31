pragma solidity ^0.4.2;

contract Main {

    // WHITELIST
    mapping(address => User) public whitelist;

    // DECLARE MASTER
    address public master = 0x03ce8855b592f9D420806690Ae31b3593eFB015c;

    // USER OBJECT
    struct User {
        string name;
        string permission;
        uint256 timestamp;
    }

    // ADD MEMBER
    function add(string _name, string _permission, address _owner) public {

        // MAKE SURE CALLER ADDRESS IS MASTER
        if (msg.sender == master) {

            // CHECK THAT ENTRY DOESNT ALREADY EXIST IN MAP
            if (whitelist[_owner].timestamp == 0) {

                // GENERATE & PUSH NEW STRUCT
                whitelist[_owner].name = _name;
                whitelist[_owner].permission = _permission;
                whitelist[_owner].timestamp = now;
            }
        }
    }
}