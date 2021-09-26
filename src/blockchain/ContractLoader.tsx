import JaJankenColiseum from './contracts/JaJankenColiseum.json'
import Web3Utils from "./Web3Utils";

declare let window: any;

export default class ContractLoader {
    static async instantiateColiseum() {
        const networkId = await Web3Utils.getNetwork()
        console.log("network", networkId)
        // @ts-ignore
        const JaJankenColiseumData = JaJankenColiseum.networks[networkId]
        console.log("JaJankenColiseumData", JaJankenColiseumData)
        if (JaJankenColiseumData) {
            return new window.web3.eth.Contract(JaJankenColiseum.abi, JaJankenColiseumData.address)
        } else {
            window.alert('JaJankenColiseum contract not deployed to detected network.')
        }

    }
}