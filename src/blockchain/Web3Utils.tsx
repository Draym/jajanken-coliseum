import Web3 from 'web3'

declare let window: any;
declare let web3: any;

export default class Web3Utils {

    static async loadMetamask() {
        if (window.ethereum) {
            await window.ethereum.request({ method: 'eth_requestAccounts' })
            window.web3 = new Web3(window.ethereum)
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    static async getNetwork() {
        return window.web3.eth.net.getId()
    }

    static async getAccounts() {
        return window.web3.eth.getAccounts()//window.ethereum.request({ method: 'eth_requestAccounts' })
    }

    static getDefaultAccount() {
        return window.web3.eth.defaultAccount
    }

    static setDefaultAccount(account: any) {
        window.web3.eth.defaultAccount = account
    }
}