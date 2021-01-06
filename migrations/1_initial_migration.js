//Takes the smart contacts and deploys it on the blockChain
const Migrations = artifacts.require("Migrations");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
