import {NextRequest, NextResponse} from "next/server"
import {formatError} from "@/utils/errors"
import chatMessageRepository from "@/server/db/repositories/chatMessageRepository"
import {Page} from "@/server/db/page"
import {MessageDTO} from "@/server/dtos/message.dto"
import dbConnect from "@/server/db/dbConnect";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const url = req.nextUrl
        const searchParams = url.searchParams
        const pageIndex = searchParams.get('pageIndex') || 0
        const pageSize = searchParams.get('pageSize') || 100

        const messages = await _getHistory({index: Number(pageIndex), size: Number(pageSize)})
        return NextResponse.json({messages})
    } catch (e) {
        return formatError(e)
    }
}

async function _getHistory(page: Page): Promise<MessageDTO[]> {
    await dbConnect()
    const messages = await chatMessageRepository.search(page)
    return messages.map(message => ({
        name: message.sender.name,
        message: message.message,
        date: message.date.toISOString()
    }))
}