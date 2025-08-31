// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DonationVault {
    address public beneficiary;
    uint256 public hardCap;
    uint256 public totalReceived;

    event Donation(address indexed donor, uint256 amount);

    constructor(address _beneficiary, uint256 _hardCap) {
        beneficiary = _beneficiary;
        hardCap = _hardCap;
    }

    function donate() public payable {
        require(totalReceived + msg.value <= hardCap, "Cap exceeded");
        totalReceived += msg.value;
        emit Donation(msg.sender, msg.value);
    }

    function withdraw() external {
        require(msg.sender == beneficiary, "Not beneficiary");
        payable(beneficiary).transfer(address(this).balance);
    }

    receive() external payable {
        donate();
    }
}