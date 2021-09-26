import NumberUtils from "../utils/NumberUtils";
import {PlayerStats} from "./data/PlayerStats";
import {GameStats} from "./data/GameStats";
import {OpponentStat} from "./data/OpponentStat";


export default class Game {

    static async getGameEntranceTicketFee(contract: any): Promise<number> {
        return await contract.methods.entranceTicketFee().call()
    }

    static async joinColiseum(contract: any, from: string) {
        const entranceTicket = await this.getGameEntranceTicketFee(contract)
        await contract.methods.joinGame().send({from: from, value: entranceTicket})
    }

    static async joinMatchQueue(contract: any, from: string) {
        await contract.methods.joinMatch().send({from: from})
    }

    static async getGameStat(contract: any): Promise<GameStats> {
        const alivePlayers = await contract.methods.alivePlayers().call()
        const totalPaa = await contract.methods.totalPaa().call()
        const totalChi = await contract.methods.totalChi().call()
        const totalGuu = await contract.methods.totalGuu().call()
        return {
            alivePlayers: NumberUtils.from(alivePlayers),
            totalPaa: NumberUtils.from(totalPaa),
            totalChi: NumberUtils.from(totalChi),
            totalGuu: NumberUtils.from(totalGuu)
        }
    }

    static async getMyProfile(contract: any): Promise<PlayerStats | null> {
        const profile = await contract.methods.getProfile().call()
        if (profile) {
            return {
                nen: NumberUtils.from(profile.nen),
                guu: NumberUtils.from(profile.guu),
                paa: NumberUtils.from(profile.paa),
                chi: NumberUtils.from(profile.chi)
            }
        } else return null
    }

    static async getOpponent(contract: any, playerAddress: any): Promise<OpponentStat | null> {
        const player = await contract.methods.getPlayer({_player: playerAddress}).call()
        if (player) {
            return {
                nen: NumberUtils.from(player.nen),
                techniques: NumberUtils.from(player.techniques),
            }
        } else return null
    }
}