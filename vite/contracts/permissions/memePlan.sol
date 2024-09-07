// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";
// import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintyWay_MintMeme is ERC20, Ownable {

    // 상태 변수
    uint public points = 100;
    bool public mintedOnce = false; // 추가발행 불가능

    // 생성자: 이름, 심볼, 수량
    constructor(string memory name, string memory symbol, uint amout)
        ERC20(name, symbol) 
        Ownable(msg.sender)
    {
        _mint(msg.sender, amout);
        mintedOnce = true;
    }


    // 민트 함수: MINTER_ROLE만 가능
    function mint(address to, uint256 amount) public onlyOwner {
        require(mintedOnce = false);
        _mint(to, amount);
        points += 20;
    }

    // 번 함수: BURNER_ROLE만 가능
    function burn(address from, uint256 amount) public onlyOwner {

        _burn(from, amount);
        points += 40;
    }

}