import {NextRequest, NextResponse} from "next/server"
import {formatError} from "@/utils/errors"
import {CreateMessageDTO} from "@/server/dtos/message.dto"
import chatMessageRepository from "@/server/db/repositories/chatMessageRepository"
import {ObjectId} from "mongodb"
import {validateSession} from "@/server/auth/session"

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const session = validateSession(req)
        console.log('send message: ', session)
        const body: {
            message: string
            receiverId?: string
        } = await req.json()
        if (!body.message) {
            return NextResponse.json({error: 'Bad request'}, {status: 400})
        }
        await _saveMessage(session.id, body)
        return NextResponse.json({success: true})
    } catch (e) {
        return formatError(e)
    }
}

async function _saveMessage(senderId: string, message: CreateMessageDTO): Promise<void> {
    await chatMessageRepository.create({
        senderId: new ObjectId(senderId),
        message: message.message,
        receiverId: message.receiverId ? new ObjectId(message.receiverId) : null
    })
}