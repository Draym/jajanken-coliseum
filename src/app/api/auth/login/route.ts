import {NextRequest, NextResponse} from "next/server"
import userRepository from '@/server/db/repositories/userRepository'
import {UserDocument} from "@/server/db/models/User"
import jwt from "@/server/auth/jwt"
import {generateNonce, SiweMessage} from "siwe"
import {formatError} from "@/utils/errors";

const message = 'Sign in with Ethereum to JaJanken.'

export async function GET(): Promise<NextResponse> {
    try {
        const nonce = generateNonce()
        return NextResponse.json({message, nonce})
    } catch (e) {
        return formatError(e)
    }
}

export async function POST(req: NextRequest): Promise<any> {
    try {
        const body: { address: string, nonce: string, signature: string, message: string } = await req.json()
        if (!body.address || !body.signature || !body.nonce || !body.message) {
            return NextResponse.json({error: 'Bad request'}, {status: 400})
        }
        const SIWEObject = new SiweMessage(message);
        const result = await SIWEObject.verify({signature: body.signature})
        console.log('result:', result)
        const user = await _signIn(body.address)
        const token = jwt.encodeJWT({id: user.id, address: user.address})
        return NextResponse.json({success: true}).cookies.set(jwt.cookieKey, token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })
    } catch (e) {
        console.error(e)
        return NextResponse.json({error: 'Authentication failed'}, {status: 401})
    }
}

const _signIn = async (address: string): Promise<UserDocument> => {
    let user = await userRepository.findByAddress(address)
    if (!user) {
        user = await userRepository.create({address, name: null, email: null})
    }
    return user
}