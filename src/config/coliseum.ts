import type {Address} from 'viem'
import {isAddress} from 'viem'

const rawAddress = process.env.NEXT_PUBLIC_COLISEUM_CONTRACT_ADDRESS?.trim()

export const coliseumContractAddress = rawAddress && isAddress(rawAddress)
    ? (rawAddress as Address)
    : undefined

export const isColiseumConfigured = Boolean(coliseumContractAddress)
