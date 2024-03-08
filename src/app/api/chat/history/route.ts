import {NextResponse} from "next/server"
import {formatError} from "@/utils/errors"

export async function GET(): Promise<NextResponse> {
    try {
        const messages = await _getHistory()
        return NextResponse.json({messages})
    } catch (e) {
        return formatError(e)
    }
}

interface Message {
    name: string
    message: string
    date: string
}

async function _getHistory(): Promise<Message[]> {
    const messages = [
        {name: 'User1', message: 'Hello!', date: new Date().toISOString()},
        {name: 'User2', message: 'Hi!', date: new Date().toISOString()},
        {name: 'User2', message: 'Hi!', date: new Date().toISOString()},
        {name: 'User2', message: 'Hi!', date: new Date().toISOString()},
        {name: 'User2', message: 'Hi!', date: new Date().toISOString()},
        {name: 'User2', message: 'Hi1!', date: new Date().toISOString()},
        {name: 'User2', message: 'Hi!', date: new Date().toISOString()},
        {name: 'User2', message: 'Hi1!', date: new Date().toISOString()},
        {name: 'User2', message: 'Hi!', date: new Date().toISOString()},
        {name: 'User2', message: 'Hi!', date: new Date().toISOString()},
        {name: 'User2', message: 'Hi5!', date: new Date().toISOString()},
        {name: 'User2', message: 'Hi4!', date: new Date().toISOString()},
        {name: 'User2', message: 'Hi3!', date: new Date().toISOString()},
        {name: 'User2', message: 'Hi2!', date: new Date().toISOString()},
        // Add more messages as needed
    ]
    return messages
}