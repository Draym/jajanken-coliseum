import {formatError, NotFound} from "@/utils/errors";
import {NextRequest, NextResponse} from "next/server";
import {validateSession} from "@/server/auth/session";
import {UserDocument} from "@/server/db/models/User";
import userRepository from "@/server/db/repositories/userRepository";

export async function PUT(req: NextRequest): Promise<NextResponse> {
    try {
        const session = validateSession(req)
        const body: { name: string | null, email: string | null } = await req.json()
        if (!body.name && !body.email) {
            return NextResponse.json({error: 'Bad request'}, {status: 400})
        }
        const user = await _updateMe(session.id, body.email, body.name)
        return NextResponse.json(user)
    } catch (e) {
        return formatError(e)
    }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const session = validateSession(req)
        const user = await _getMe(session.id)
        return NextResponse.json(user)
    } catch (e) {
        return formatError(e)
    }
}

async function _getMe(userId: string): Promise<UserDocument> {
    return await userRepository.get(userId)
}

async function _updateMe(userId: string, email: string | null, name: string | null): Promise<UserDocument> {
    const user = await userRepository.updateById(userId, {email, name})
    if (!user) {
        throw new NotFound('User not found')
    }
    return user
}