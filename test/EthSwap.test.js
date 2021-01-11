const { assert } = require('chai');
const { default: Web3 } = require('web3');

const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

require('chai').use(require('chai-as-promised')).should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

//Test before the smart contarct is deployed to the blockchain network
contract('EThSwap', ([deployer, investor]) => {

    let token, ethSwap
    before(async () => {
        token = await Token.new()
        ethSwap = await EthSwap.new(token.address)
        //Transfer all tokens to EthSwap(1 million)
        await token.transfer(ethSwap.address, tokens('1000000'))
    })

    describe('Token deployment', async () => {
        it('contract has a name', async () => {
            const name = await token.name()
            assert.equal(name, 'FD Token')
        })
    })

    describe('EthSwap deployment', async () => {
        it('contract has a name', async () => {
            const name = await ethSwap.name()
            assert.equal(name, 'EthSwap Instant Exchange')
        })

        it('contract has tokens', async() => {
            let balance = await token.balanceOf(ethSwap.address)
            assert.equal(balance.toString(),tokens('1000000'))
        })
    })

    describe('BuyTokens()', async () => {
        let result;

        before(async () => {
            result = await ethSwap.buyTokens({
                from: investor,
                value: web3.utils.toWei('1', 'ether')
            })
        })
        it('Allows user to instantly purchase tokens from ethSwap for a fixed price', async () =>{
            //check investor balance for a differnce after a purchase.
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100'))

            //check ethSwap balance after purchase
            let ethSwapBalance
            ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens('999900'))
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1', 'Ether'))

             //check logs to make surte the event was emitted with the correct data
            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100')
        })
    })

    describe('BuyTokens()', async () => {
        let result;

        before(async () => {
            //Investor must approve the Tokens before the purchase
            await token.approve(ethSwap.address, tokens('100'), {from: investor})
            //Investor sells the token
            result = await ethSwap.sellTokens(tokens('100'), {from: investor})
           
        })
        it('Allows user to instantly sell tokens to ethSwap for a fixed price', async () =>{
            //check investor balance for a differnce after a purchase.
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('0'))
            
             //check ethSwap balance after purchase
             let ethSwapBalance
             ethSwapBalance = await token.balanceOf(ethSwap.address)
             assert.equal(ethSwapBalance.toString(), tokens('1000000'))
             ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
             assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0', 'Ether'))

             //check logs to make surte the event was emitted with the correct data
             const event = result.logs[0].args
             assert.equal(event.account, investor)
             assert.equal(event.token, token.address)
             assert.equal(event.amount.toString(), tokens('100').toString())
             assert.equal(event.rate.toString(), '100')

             //FAILURE; investor cant sell more tokens that they have
             await ethSwap.sellTokens(tokens('500'), {from: investor}).should.be.rejected
        })
    })
})