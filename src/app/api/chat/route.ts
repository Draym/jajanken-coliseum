import {NextResponse} from "next/server"
import {formatError} from "@/utils/errors"

export async function GET(): Promise<NextResponse> {
    try {
        const messages = await _saveMessage()
        return NextResponse.json({success: true})
    } catch (e) {
        return formatError(e)
    }
}

async function _saveMessage(): Promise<void> {
}