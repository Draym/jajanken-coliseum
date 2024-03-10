import mongoose from 'mongoose'
import {UserDocument} from "@/server/db/models/User"
import {ObjectId} from "mongodb"

export interface ICreateChatMessage {
    senderId: ObjectId
    receiverId: ObjectId | null
    message: string
}

export interface ChatMessageDocument extends mongoose.Document {
    sender: UserDocument
    receiver: UserDocument | null
    message: string
    date: Date
}

const ChatMessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a sender.']
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        nullable: true
    },
    message: {
        type: String,
        required: [true, 'Please provide a message.']
    },
    date: {
        type: Date,
        default: Date.now
    }
})

export const ChatMessage = mongoose.models.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema)
