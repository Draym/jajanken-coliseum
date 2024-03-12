import {Config, useChainId, useReadContract, useWriteContract} from "wagmi"
import contracts, {Contract} from "@/blockchain/contracts"
import {ethers} from "ethers";
import {WriteContractMutate} from "@wagmi/core/query";

type uint = bigint
type uint8 = bigint
type uint32 = bigint
type uint256 = bigint
type bytes32 = string
type bytes = string
type address = string

export enum Technique {
    None,
    Red,
    Green,
    Blue
}

export interface Player {
    red: uint8;
    green: uint8;
    blue: uint8;
    soul: uint32;
}

const useGameConfig = (): Contract | null => {
    const chainId = useChainId()
    console.log('chainId', chainId)
    if (!chainId || !contracts[chainId]) return null
    return contracts[chainId].game
}


// external view
function entranceTicketCost(): uint256 | undefined {
    const contractConfig = useGameConfig()
    console.log('contractConfig', contractConfig)
    const {data: ticketCost} = useReadContract({
        ...contractConfig,
        functionName: 'entranceTicketCost',
        args: [],
    })
    return ticketCost as uint256
}

// external pure
function encodeAction(_yourAddress: address, _action: Technique, _revealKey: bytes32): bytes32 | undefined {
    const contractConfig = useGameConfig()
    const {data: bytes} = useReadContract({
        ...contractConfig,
        functionName: 'encodeAction',
        args: [_yourAddress, _action, _revealKey],
    })
    return bytes as bytes32
}

// external view
function getProfile(): Player | undefined {
    const contractConfig = useGameConfig()
    const {data: profile} = useReadContract({
        ...contractConfig,
        functionName: 'getProfile',
        args: [],
    })
    return profile as Player
}

// external view
function getPlayer(_player: address): Player | undefined {
    const contractConfig = useGameConfig()
    const {data: profile} = useReadContract({
        ...contractConfig,
        functionName: 'getPlayer',
        args: [_player],
    })
    return profile as Player
}

// external view
function getTotalSoul(): uint | undefined {
    const contractConfig = useGameConfig()
    const {data: ticketCost} = useReadContract({
        ...contractConfig,
        functionName: 'getTotalSoul',
        args: [],
    })
    return ticketCost as uint
}

// external view
function getTotalRed(): uint | undefined {
    const contractConfig = useGameConfig()
    const {data: ticketCost} = useReadContract({
        ...contractConfig,
        functionName: 'getTotalRed',
        args: [],
    })
    return ticketCost as uint
}

// external view
function getTotalGreen(): uint | undefined {
    const contractConfig = useGameConfig()
    const {data: ticketCost} = useReadContract({
        ...contractConfig,
        functionName: 'getTotalGreen',
        args: [],
    })
    return ticketCost as uint
}

// external view
function getTotalBlue(): uint | undefined {
    const contractConfig = useGameConfig()
    const {data: ticketCost} = useReadContract({
        ...contractConfig,
        functionName: 'getTotalBlue',
        args: [],
    })
    return ticketCost as uint
}

/**
 * Check if there is fund to withdraw
 * only available for game owner
 */
function hasFundToWithdraw(): uint256 {
    const contractConfig = useGameConfig()
    const {data: ticketCost} = useReadContract({
        ...contractConfig,
        functionName: 'hasFundToWithdraw',
        args: [],
    })
    return ticketCost as uint
}

// /**
//  * Withdraw excess balance of funds
//  * only available for game owner
//  */
// function withdrawExcessiveBalance(address payable _recipient) external onlyOwner {
// const {data: hash, writeContract} = useWriteContract()
// }

// external payable
function joinGame(writeContract?: WriteContractMutate<Config, any>, entranceTicket?: uint256): () => void {
    const contractConfig = useGameConfig()

    return () => {
        if (!contractConfig || !entranceTicket || !writeContract) return
        writeContract({
            ...contractConfig,
            functionName: 'joinGame',
            args: [],
            value: ethers.parseUnits(entranceTicket.toString(), 'wei'),
        })
    }
}

//
// function playMatch(bytes32 _commitment, address _p1, address _p2, bytes memory _matchSig) external override(JaJanken) {
// }
//
// function revealMatch(Technique _action, bytes32 _revealKey, address _p1, address _p2, bytes memory _matchSig) external override(JaJanken) {
// }
//
// function waitingForOpponentToPlay(address _matchId) external view override(JaJanken) returns (bool) {
//
// }
//
// function waitingForOpponentToReveal(address _matchId) external view override(JaJanken) returns (bool) {
// }
//
// function skipAfkDuringPlay(address _matchId) external override(JaJanken) {
//
// }
//
// function skipAfkDuringReveal(address _matchId) external override(JaJanken) {
//
// }
//
// /**
//  * Withdraw gains from the Game
//  * only available at the end of the Game, do nothing otherwise
//  */
// function withdrawGains() external override(JaJanken) {
// }


export default {
    entranceTicketCost,
    encodeAction,
    getProfile,
    getPlayer,
    getTotalSoul,
    getTotalRed,
    getTotalGreen,
    getTotalBlue,
    hasFundToWithdraw,
    joinGame
}