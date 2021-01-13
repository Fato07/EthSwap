import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3'
import NavBar from './NavBar'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    console.log(window.web3)
  }

  async loadWeb3() {
    
    // Legacy dapp browsers...
    if (window.etherum) {
      window.web3 = new Web3(window.etherum);
      await window.etherum.enable();
    }
    // Non-dapp browsers...
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async loadBlockchainData(){
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    console.log(accounts)
    this.setState({account: accounts[0]})
    console.log(this.state.account)

    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ethBalance})
    console.log(ethBalance)


  }

  constructor(props) {
    super(props)
    this.state = {
      account: ' ',
      ethBalance: 0
    }
  }
  render() {
    return (
      <div>
        <NavBar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
