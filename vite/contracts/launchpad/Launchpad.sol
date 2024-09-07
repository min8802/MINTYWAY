// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract Launchpad {
    address public owner;
    address public tokenAddress;
    uint public subscriberCount;
    IERC20 token;

    struct ILotteryWinner {
        address buyer;
        uint wins;
    }

     struct ILotteryNonWinner {
        address buyer;
        uint nonWins;
    }

    constructor(address _tokenAddress) {
        tokenAddress = _tokenAddress;
        owner = msg.sender;
        isLotteryExcuted = false;
        token = IERC20(_tokenAddress);
    }

    mapping(address => uint) ticketAmount;
    mapping(address => bool) public subscribers;
    mapping(address => uint) scores;
    mapping(address => uint) public winners;
    mapping(address => uint) public nonWinners;
    address[] public buyer;
    bool isLotteryExcuted;

    function subscription(address _sender, uint _point) public {
        require(!subscribers[_sender], unicode"이미 구독 중입니다.");
        require(_point >= 100, unicode"포인트가 부족합니다.");
        subscribers[_sender] = true;
        subscriberCount++;
    }

    function getSubscribers() public view returns(uint) {
        return subscriberCount;
    }

    function isSubscribe(address _sender) public view returns(bool) {
        return subscribers[_sender];
    }

    function buyTicket(address _sender, uint _ticketPrice, uint _ticketAmount) public payable {
        require(subscribers[_sender], unicode"구독 대상자가 아닙니다.");
        require(msg.value >= _ticketPrice * _ticketAmount, unicode"금액이 부족합니다.");
        ticketAmount[_sender] += _ticketAmount;
        for (uint i = 0; i < _ticketAmount; i ++) {
            buyer.push(_sender);
        }
    }

    function getTicketAmount(address _sender) public view returns(uint) {
        return ticketAmount[_sender];
    }

    function getBuyer() public view returns(address[] memory) {
        return buyer;
    }

    function setLotteryResult(ILotteryWinner[] calldata _winners, ILotteryNonWinner[] calldata _nonWinners) public {
        require(!isLotteryExcuted, unicode"이미 실행되었습니다.");
        for (uint i = 0; i < _winners.length; i ++) {
            winners[_winners[i].buyer] = _winners[i].wins;
        }

         for (uint i = 0; i < _nonWinners.length; i ++) {
            nonWinners[_nonWinners[i].buyer] = _nonWinners[i].nonWins;
        }

        isLotteryExcuted = true;
    }

    function getIsExcuted() public view returns(bool) {
        return isLotteryExcuted;
    }

    function isWinner(address _sender) public view returns(bool) {
        return winners[_sender] > 0;
    }

    function isNonWinner(address _sender) public view returns(bool) {
        return nonWinners[_sender] > 0;
    }

    function launchpadClaimToken(address _sender, uint _claimAmount) public {
        require(winners[_sender] > 0, unicode"당첨되지 않았습니다.");
        require(ticketAmount[_sender] > 0, unicode"구매한 티켓이 없습니다.");
        bool success = token.transfer(_sender, _claimAmount);
        require(success, unicode"토큰 전송이 실패했습니다.");
        ticketAmount[_sender] -= winners[_sender];
        winners[_sender] = 0;
    }

    function launchpadRefundETH(address _sender, uint _refundAmount) public {
        require(nonWinners[_sender] > 0, unicode"환불받을 수 없습니다.");
        require(ticketAmount[_sender] > 0, unicode"구매한 티켓이 없습니다.");
        payable(_sender).transfer(_refundAmount);
        ticketAmount[_sender] -= nonWinners[_sender];
        nonWinners[_sender] = 0;
    }

    function withdraw() public {
        require(msg.sender == owner, unicode"Owner가 아닙니다.");
        payable(owner).transfer(address(this).balance);
    }
}