import mongoose from 'mongoose'

export interface ICreateUser {
    name: string | null
    address: string
    email: string | null
}

export interface UserDocument extends mongoose.Document {
    name: string
    address: string
    email: string | null
}

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        sparse: true,
        nullable: true
    },
    address: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        nullable: true
    }
})

export const User = mongoose.models.User || mongoose.model('User', UserSchema)
