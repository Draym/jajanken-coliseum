import {ChatMessage, ChatMessageDocument, ICreateChatMessage} from '@/server/db/models/ChatMessage'
import {ObjectId} from 'mongodb'
import {Page} from "@/server/db/page"
import {NotFound} from "@/utils/errors"

const get = async (id: ObjectId): Promise<ChatMessageDocument> => {
    const chatMessage = await ChatMessage.findById(id)
    if (!chatMessage) {
        throw new NotFound('ChatMessage not found')
    }
    return chatMessage
}
const find = async (id: string | ObjectId): Promise<ChatMessageDocument | null> => await ChatMessage.findById(id)
const search = async (page: Page): Promise<ChatMessageDocument[]> => {
    return ChatMessage.find({})
        .sort({date: -1})
        .skip(page.index * page.size)
        .limit(page.size);
}
const create = async (chatMessage: ICreateChatMessage): Promise<ChatMessageDocument> => await ChatMessage.create(chatMessage)

export default {
    get,
    find,
    search,
    create
}