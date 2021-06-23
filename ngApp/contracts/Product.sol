// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Product {
    event Added(uint index, address owner, string ownerName, string name, uint price, string manufactDate, string manufacturerName);

    string private name;
    struct Products {
        address owner;
        string manufacturerName;
        string ownerName;
        uint serialNo;
        string name;
        uint price;
        string manufactDate;
    }

    mapping(uint => Products) products;
    // mapping(uint => Products) ProductsFromSerialNo;
    uint256 len = 0;

    constructor(string memory _name) public{
        name = _name;
    }

    function getName() public view returns(string memory) {
        return name;
    }

    function setName(string memory _name) public {
        name = _name;
    }

    function newProduct(string memory _manufacturerName, string memory _ownerName, uint _serialNo, string memory _name, uint _price, string memory _date) public {
        Products memory p = Products({owner: msg.sender, manufacturerName: _manufacturerName, ownerName: _ownerName, serialNo: _serialNo, name: _name, price: _price, manufactDate: _date});
        products[len] = p;
        emit Added(len, msg.sender, _ownerName, _name, _price, _date, _manufacturerName);
        len = len + 1;
    }

    function getProduct(uint _len) public view returns (uint, string memory, uint, string memory, string memory, string memory) {
        require(_len < len + 1 && _len > 0);

        return (_len, products[ _len - 1].name, products[ _len - 1].price, products[ _len - 1].manufactDate, products[ _len - 1].ownerName, products[ _len - 1].manufacturerName);
    }

    function changeOwner(uint _len, address _owner, string memory _ownerName) public{
        require((_len < len + 1 && _len > 0) && products[_len - 1].owner == msg.sender);

        products[_len - 1].owner = _owner;
        products[_len - 1].ownerName = _ownerName;
    }
}
