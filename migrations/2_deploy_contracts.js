//Takes the smart contacts and deploys it on the blockChain
const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

module.exports = async function(deployer) {
  //deploy Token
  await deployer.deploy(Token);
  const token = await Token.deployed()

  //deploy EthSwap
  await deployer.deploy(EthSwap);
  const ethSwap = await EthSwap.deployed()

  //Transfer all tokens to EthSwap(1 million)
  await token.transfer(ethSwap.address, '1000000000000000000000000')
};