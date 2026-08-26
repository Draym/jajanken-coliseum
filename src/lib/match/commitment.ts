import type {Address, Hex} from 'viem'
import {encodePacked, keccak256, toHex} from 'viem'
import type {TechniqueId} from '@/lib/techniques'
import {techniqueIdToContract} from '@/lib/match/technique-enum'

export function generateRevealKey(): Hex {
    const bytes = crypto.getRandomValues(new Uint8Array(32))
    return toHex(bytes)
}

/** Mirrors contract encodeAction: keccak256(abi.encodePacked(address, technique, revealKey)) */
export function encodeActionLocally(player: Address, technique: TechniqueId, revealKey: Hex): Hex {
    return keccak256(
        encodePacked(
            ['address', 'uint8', 'bytes32'],
            [player, techniqueIdToContract(technique), revealKey],
        ),
    )
}
