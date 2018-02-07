pragma solidity 0.4.19;

import { Ownable } from "zeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title AddressBook
 * @dev Allows to store addresses in contract
 * @author Wojciech Harzowski (https://github.com/harzo/)
 */
contract AddressBook is Ownable {

    address[] private book;

    mapping (address => bool) private existence;

    modifier onlyValidAddress(address _address) {
        require(_address != address(0));
        _;
    }

    modifier onlyExisting(address _address) {
        require(existence[_address]);
        _;
    }

    modifier onlyNotExisting(address _address) {
        require(!existence[_address]);
        _;
    }

    function AddressBook() public {

    }

    event AddressAdded(address newAddress);

    event AddressRemoved(address removedAddress);

    event AddressBookCleared();

    function add(address newAddress)
        public
        onlyOwner
        onlyValidAddress(newAddress)
        onlyNotExisting(newAddress)
    {
        book.push(newAddress);
        existence[newAddress] = true;

        AddressAdded(newAddress);
    }

    function remove(address _address)
        public
//        onlyOwner
//        onlyValidAddress(_address)
//        onlyExisting(_address)
    {

    }

    function contains(address _address)
        public
        view
        returns (bool)
    {
        return existence[_address];
    }

    function get()
        public
        view
        returns (address[])
    {
        return book;
    }
}
