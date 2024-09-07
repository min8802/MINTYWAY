// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract LaunchpadManager {
    
    mapping(address => address) launchpadList;
    address[] tokenAddressList;

    function addLaunchpad(address _tokenAddress, address _launchpadAddress) public {
        require(launchpadList[_tokenAddress] == address(0), unicode"이미 런치패드가 진행 중입니다.");
        launchpadList[_tokenAddress] = _launchpadAddress;
        tokenAddressList.push(_tokenAddress);
    }

    function getLaunchpad(address _tokenAddress) public view returns(address) {
        return launchpadList[_tokenAddress];
    }

    function getLaunchpadList() public view returns(address[] memory) {
        address[] memory launchpadAddress = new address[](tokenAddressList.length);
        for (uint i = 0; i < tokenAddressList.length; i ++) {
            launchpadAddress[i] = launchpadList[tokenAddressList[i]];
        }
        return launchpadAddress;
    } 
}