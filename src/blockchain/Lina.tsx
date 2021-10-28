import Web3Utils from "./Web3Utils";

export default class Lina {

    static async call(method: any, data: object = {}) {
        return method.call({from: Web3Utils.getDefaultAccount(), ...data})
    }

    static async send(method: any, data: object = {}) {
        return method.send({from: Web3Utils.getDefaultAccount(), ...data})
    }
}