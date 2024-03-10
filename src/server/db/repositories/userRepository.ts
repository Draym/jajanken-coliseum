import { User, UserDocument, ICreateUser } from '@/server/db/models/User'
import { ObjectId } from 'mongodb'
import {NotFound} from "@/utils/errors";

const get = async (id: string | ObjectId): Promise<UserDocument> => {
    const user = await User.findById(id)
    if (!user) {
        throw new NotFound('User not found')
    }
    return user
}
const getByAddress = async (address: string): Promise<UserDocument> => {
    const user = await User.findOne({ address })
    if (!user) {
        throw new NotFound('User not found')
    }
    return user
}
const find = async (id: string | ObjectId): Promise<UserDocument | null> => await User.findById(id)
const findByAddress = async (address: string): Promise<UserDocument | null> => await User.findOne({ address })
const create = async (user: ICreateUser): Promise<UserDocument> => await User.create(user)
const updateById = async (id: string | ObjectId, user: ICreateUser): Promise<UserDocument | null> => await User.findByIdAndUpdate(id, user)
const deleteById = async (id: string | ObjectId): Promise<any> => await User.deleteOne({ _id: id })

export default {
    get,
    getByAddress,
    find,
    findByAddress,
    create,
    updateById,
    deleteById,
}