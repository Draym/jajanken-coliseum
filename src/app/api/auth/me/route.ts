import {formatError} from "@/utils/errors";
import {NextRequest, NextResponse} from "next/server";
import {validateSession} from "@/server/auth/session";
import {UserDocument} from "@/server/db/models/User";
import userRepository from "@/server/db/repositories/userRepository";

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