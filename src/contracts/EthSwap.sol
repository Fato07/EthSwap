// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0;

import './Token.sol';

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint public rate = 100;

    event Tokenspurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    event TokensSold(
        address account,
        address token,
        uint amount,
        uint rate
    );



    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable{
        //To calculate nr of tokens to buy
        // Amount of Etherum* Redemption Rate
        //Redemptoin Rate = Nr of Tojens they recieve for  1 ether
        uint tokenAmount = msg.value * rate;

        //Require EthSwap has enough Tokens for buying
        //To perevent someone from buying more that what the total token supply the exchange has.
        //if not, thows an error, and the function stops
        //require(token.balanceOf(address(this)) >= tokenAmount);

        //Transfer Tokens to the User
        token.transfer(msg.sender, tokenAmount);

        //Emit an event
        emit Tokenspurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public {
        //User cant sell more Tokens that they have
        require(token.balanceOf(msg.sender) >= _amount);

        //calculate the amount of Ether to redeem
        uint etherAmount = _amount / rate;

        //require that Ethswap has enough ETher before selling
        require(address(this).balance >= etherAmount);

        //perform sale
        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);

         //Emit an event
        emit TokensSold(msg.sender, address(token), _amount, rate);

    }
}
