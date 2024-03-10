import {NotAuthorized, ServerError} from "@/utils/errors"
import jwt from "jsonwebtoken"

export interface Token {
    id: string
    address: string
}

const cookieKey = 'token'

const decodeJWT = (token: string): Token => {
    console.log('decodeJWT:', token)
    if (!token) {
        throw new NotAuthorized('No token provided')
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new ServerError('JWT not configured properly')
    }
    try {
        const decoded = jwt.verify(token, secret)
        return decoded as Token
    } catch (e) {
        throw new ServerError('Failed to authenticate token')
    }
}

const encodeJWT = (token: Token): string => {
    console.log('encodeJW: ', token)
    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new ServerError('JWT not configured properly')
    }
    return jwt.sign(token, secret)
}

export default {
    cookieKey,
    decodeJWT,
    encodeJWT,
}