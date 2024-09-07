// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 < 0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract multiV1 {
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "you are not the owner");
        _;
    }
    
    function multisender(address[] memory receiver, uint[] memory amount) public payable{
        uint fee = 0.0001 ether;
        uint arrayLimit = 100; //멀티센드는 최대 100개 주소
        require(receiver.length == amount.length, "Check number of address, receiver"); //주소 수와 보내는 양의 갯수가 일치
        require(receiver.length <= arrayLimit); //멀티센드 최대 100개까지
        uint totalSendAmount = 0;
        
        uint totalFee;

        for (uint256 i = 0; i < amount.length; i++) {
            totalSendAmount += amount[i];
        }
        
        totalFee = fee * receiver.length;
        
        require(msg.value >= totalSendAmount + totalFee, "Not enough Ether sent");

        for (uint i=0; i < receiver.length; i++) {
            payable(receiver[i]).transfer(amount[i]);
        }
    }

    function withDraw() public payable onlyOwner{
        payable(msg.sender).transfer(address(this).balance);
    }
}


