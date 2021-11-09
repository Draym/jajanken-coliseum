import NumberUtils from "../utils/NumberUtils";
import {PlayerStats} from "./data/PlayerStats";
import {GameStats} from "./data/GameStats";
import {OpponentStats} from "./data/OpponentStats";
import Lina from "../blockchain/Lina";
import Web3Utils from "../blockchain/Web3Utils";
import {JaJankenTechnique} from "./data/JaJankenTechnique";
import {v4 as uuidv4} from "uuid";
import {MatchStats} from "./data/MatchStats";

export default class JaJanken {

    static async getGameEntranceTicketFee(contract: any): Promise<number> {
        return await Lina.call(contract.methods.entranceTicketFee())
    }

    static async joinColiseum(contract: any) {
        this.getGameEntranceTicketFee(contract).then(entranceTicket => {
            Lina.send(contract.methods.joinGame(), {value: entranceTicket})
        })
    }

    static async joinMatchQueue(contract: any) {
        Lina.send(contract.methods.joinMatch()).then(_ => {
        })
    }

    static async getGameStats(contract: any): Promise<GameStats> {
        const alivePlayers = await Lina.call(contract.methods.alivePlayers())
        const totalPaa = await Lina.call(contract.methods.totalPaa())
        const totalChi = await Lina.call(contract.methods.totalChi())
        const totalGuu = await Lina.call(contract.methods.totalGuu())
        return {
            alivePlayers: NumberUtils.from(alivePlayers),
            totalPaa: NumberUtils.from(totalPaa),
            totalChi: NumberUtils.from(totalChi),
            totalGuu: NumberUtils.from(totalGuu)
        }
    }

    static async getMyProfile(contract: any): Promise<PlayerStats | null> {
        const profile = await Lina.call(contract.methods.getProfile())
        const queued = await Lina.call(contract.methods.queued())
        if (profile) {
            return {
                inQueue: queued === Web3Utils.getDefaultAccount(),
                inMatch: profile.inMatch === Web3Utils.nullAddress() ? null : profile.inMatch,
                nen: NumberUtils.from(profile.nen),
                guu: NumberUtils.from(profile.guu),
                paa: NumberUtils.from(profile.paa),
                chi: NumberUtils.from(profile.chi)
            }
        } else return null
    }

    static async getOpponent(contract: any, playerAddress: string | null): Promise<OpponentStats | null> {
        if (playerAddress == null)
            return null
        const player = await Lina.call(contract.methods.getPlayer(playerAddress))
        if (player) {
            return {
                nen: NumberUtils.from(player.nen),
                techniques: NumberUtils.from(player.techniques),
            }
        } else return null
    }

    static async getMatch(contract: any, matchId: string): Promise<MatchStats | null> {
        const match = await Lina.call(contract.methods.matches(matchId))
        if (match) {
            return {
                p2: match.p2,
                p1Hidden: match.p1Hidden,
                p2Hidden: match.p2Hidden,
                p1Revealed: parseInt(match.p1Revealed),
                p2Revealed: parseInt(match.p2Revealed),
                playTime: parseInt(match.playTime),
                revealTime: parseInt(match.revealTime)
            }
        } else return null
    }

    static Player = class {

        static getKey(): string {
            let key = localStorage.getItem('jajanken-key$' + Lina.account())
            if (key == null) {
                key = this.initKey()
            }
            return key
        }

        static initKey(): string {
            const key = uuidv4().substring(0, 20)
            localStorage.setItem('jajanken-key$' + Lina.account(), key)
            return key
        }

        static getPlayed(): JaJankenTechnique {
            let key = localStorage.getItem('jajanken-played$' + Lina.account())
            if (key == null || key === '') {
                return JaJankenTechnique.None
            } else {
                return parseInt(key)
            }
        }

        static savePlay(technique: JaJankenTechnique) {
            localStorage.setItem('jajanken-played$' + Lina.account(), technique.toString())
        }

        static async commitPlay(contract: any, matchId: string, technique: JaJankenTechnique) {
            Lina.call(contract.methods.encodeAction(Lina.account(), technique, Web3Utils.encode(this.getKey()))).then(encodedTechnique => {
                Lina.send(contract.methods.playMatch(encodedTechnique, matchId)).then(_ => {
                })
            })
        }

        static async revealPlay(contract: any, matchId: string, technique: JaJankenTechnique) {
            Lina.send(contract.methods.revealMatch(technique, Web3Utils.encode(this.getKey()), matchId)).then(_ => {
            })
        }
    }
}
