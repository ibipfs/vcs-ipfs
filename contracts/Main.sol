pragma solidity ^0.4.2;

contract Main {

    // WHITELIST
    mapping(address => User) public whitelist;

    // CONTRACT ADMIN
    address public admin = 0x45597FE80FE0F6dedEbe3359dC6C59A5414Fc9A2;

    // USER OBJECT
    struct User {
        string name;
        uint256 timestamp;
    }

    // ADD MEMBER
    function add(string _name, address _owner) public {

        // MAKE SURE CALLER ADDRESS IS ADMIN
        if (msg.sender == admin) {

            // CHECK THAT ENTRY DOESNT ALREADY EXIST IN MAP
            if (whitelist[_owner].timestamp == 0) {

                // GENERATE & PUSH NEW STRUCT
                whitelist[_owner].name = _name;
                whitelist[_owner].timestamp = now;
            }
        }
    }
}