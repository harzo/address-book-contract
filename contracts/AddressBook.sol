pragma solidity 0.4.19;

import { Ownable } from "zeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title AddressBook (AB)
 * @dev Allows to store addresses in contract
 * @author Wojciech Harzowski (https://github.com/harzo/)
 */
contract AddressBook is Ownable {

    /**
     * @dev Stores addresses added to AB
     */
    address[] private book;

    /**
     * @dev Indicates if address exists in AB
     */
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

    /**
     * @dev New address has been added to AB
     * @param newAddress address Address added to AB
     */
    event AddressAdded(address newAddress);

    /**
     * @dev Existing address has been removed from AB
     * @param removedAddress address Address removed from AB
     */
    event AddressRemoved(address removedAddress);

    /**
     * @dev Address Book has been cleared
     */
    event AddressBookCleared();

    /**
     * @dev Adds new address to AB and sets its existence
     * @param newAddress address Address which should be added to AB
     */
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

    /**
     * @dev Removes existing address from AB and clears its existence
     * @param _address address Address which should be removed from AB
     */
    function remove(address _address)
        public
        onlyOwner
        onlyValidAddress(_address)
        onlyExisting(_address)
    {
        if (book.length == 1) {
            delete book;
        } else {
            book[index(_address)] = book[book.length - 1];
            book.length--;
        }
        existence[_address] = false;

        AddressRemoved(_address);
    }

    /**
     * @dev Clears AB from all addresses
     */
    function clear()
        public
        onlyOwner
    {
        for (uint i = 0; i < book.length; i++) {
            existence[book[i]] = false;
        }

        delete book;

        AddressBookCleared();
    }

    /**
     * @dev Checks if address exists in AB
     * @param _address address Address to check
     * @return Address existence indicator
     */
    function contains(address _address)
        public
        view
        returns (bool)
    {
        return existence[_address];
    }

    /**
     * @dev Gets stored in AB addresses
     * @return Stored addresses
     */
    function get()
        public
        view
        returns (address[])
    {
        return book;
    }

    /**
     * @dev Returns address index in address storage
     * @param _address address Address to check
     * @return Address index
     */
    function index(address _address)
        internal
        view
        returns (uint)
    {
        for (uint i = 0; i < book.length; i++) {
            if (_address == book[i]) {
                return i;
            }
        }
    }
}
