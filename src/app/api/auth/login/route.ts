import {NextRequest, NextResponse} from "next/server"
import userRepository from '@/server/db/repositories/userRepository'
import {UserDocument} from "@/server/db/models/User"
import jwt from "@/server/auth/jwt"
import {generateNonce, SiweMessage} from "siwe"

const message = 'Sign in with Ethereum to JaJanken.'

export async function GET(): Promise<NextResponse> {
    const nonce = generateNonce()
    return NextResponse.json({message, nonce})
}

export async function POST(req: NextRequest): Promise<any> {
    try {
        const body: { address: string,nonce: string, signature: string } = await req.json()
        if (!body.address || !body.signature || !body.nonce) {
            return NextResponse.json({error: 'Bad request'}, {status: 400})
        }
        const SIWEObject = new SiweMessage(message);
        await SIWEObject.verify({signature: body.signature, nonce: body.nonce});

        const user = await _signIn(body.address)
        const token = jwt.encodeJWT({id: user.id, address: user.address})
        return NextResponse.json({success: true}).cookies.set(jwt.cookieKey, token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })
    } catch (e) {
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