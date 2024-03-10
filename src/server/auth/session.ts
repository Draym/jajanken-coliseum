import jwt, {Token} from "@/server/auth/jwt"
import {NotAuthorized} from "@/utils/errors"
import {RequestCookies} from "next/dist/compiled/@edge-runtime/cookies"
import {NextRequest} from "next/server";

export const validateSession = (req: NextRequest): Token => {
    const token = extractToken(req.cookies)
    return jwt.decodeJWT(token)
}

export const extractToken = (cookies: RequestCookies): string => {
    const cookieHoldingToken = cookies.get(jwt.cookieKey)
    if (!cookieHoldingToken) {
        throw new NotAuthorized('No token provided')
    }
    return cookieHoldingToken.value
}