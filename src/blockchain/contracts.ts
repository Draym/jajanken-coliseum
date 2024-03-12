import JaJankenGame from "./contracts/JaJankenGame.json"

export interface Contract {
    abi: any
    address: `0x${string}`
}

export interface Contracts {
    game: Contract
}

const contracts: { [key: number]: Contracts } = {
    // MUMBAI
    80001: {
        game: {
            abi: JaJankenGame.abi,
            address: "0x7900C9032fE4B223DFCa1CF299C3cD48A13c5673"
        }
    }
}

export default contracts