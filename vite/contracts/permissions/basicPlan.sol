// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintyWay_MintBasic is ERC20, AccessControlEnumerable, Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    // 역할 정의하기
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    // 상태 변수
    bool public isMintable = true;
    bool public isBurnable = true;
    uint public points = 500;

    // 생성자: 이름, 심볼, 수량
    // 기본 관리자= msg.sender
    // 기본적으로 토큰을 만든 계정은 모든 권한을 가지고 있음
    constructor(string memory name, string memory symbol, uint amout)
        ERC20(name, symbol) 
        Ownable(msg.sender)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _mint(msg.sender, amout);
        addMinter(msg.sender);
        addBurner(msg.sender);
    }


    // 민트 함수: MINTER_ROLE만 가능
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(isMintable, "Minting is disabled");
        _mint(to, amount);
        points += 20;
    }

    // 번 함수: BURNER_ROLE만 가능
    function burn(address from, uint256 amount) public onlyRole(BURNER_ROLE) {
        require(isBurnable, "Burning is disabled");
        _burn(from, amount);
        points += 40;
    }

    // <==  여기부터 ROLE 관련 함수들  ==>

    // 역할 추가 함수: 오너만 호출 가능
    function addMinter(address account) public onlyOwner {
        grantRole(MINTER_ROLE, account);
        points += 100;
    }

    function addBurner(address account) public onlyOwner {
        grantRole(BURNER_ROLE, account);
        points += 100;
    }

    // 역할 제거 함수: 오너만 호출 가능
    function removeMinter(address account) public onlyOwner {
        revokeRole(MINTER_ROLE, account);
        points += 100;
    }

    function removeBurner(address account) public onlyOwner {
        revokeRole(BURNER_ROLE, account);
        points += 100;
    }


    // 모디파이어: REVOKE
    modifier revokeRoleAndDisable(bytes32 role, bool storageFlag) {
        // 모든 role 권한을 가진 계정을 조회하고 제거
        uint256 roleCount = getRoleMemberCount(role);
        for (uint256 i = 0; i < roleCount; i++) {
            address member = getRoleMember(role, 0); // 항상 0번째 인덱스를 사용 (0번을 제거하면 다음 것이 0번이 됨)
            revokeRole(role, member);
        }
        // role을 제거할 수 없도록 역할 자체를 삭제
        _revokeRole(DEFAULT_ADMIN_ROLE, address(this)); // 이 컨트랙트 주소에서 관리자 권한 제거
        _revokeRole(role, address(this)); // 이 컨트랙트 주소에서 역할 제거
        _setRoleAdmin(role, 0x00); // 역할의 관리자 역할을 0x00으로 설정하여 더 이상 권한 부여가 불가능하도록 함
        storageFlag = false; // 더 이상 기능 불가능
        points += 300;
        _;
    }

    
    // MINT, BURN 기능을 없애는 함수
    function revokeMinter() public onlyOwner revokeRoleAndDisable(MINTER_ROLE, isMintable) {}

    function revokeBurner() public onlyOwner revokeRoleAndDisable(BURNER_ROLE, isBurnable) {}
}