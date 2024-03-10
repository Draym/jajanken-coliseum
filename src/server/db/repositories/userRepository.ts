import { User, UserDocument, ICreateUser } from '@/server/db/models/User'
import { NotFound } from 'http-errors'
import { ObjectId } from 'mongodb'

const get = async (id: ObjectId): Promise<UserDocument> => {
    const user = await User.findById(id)
    if (!user) {
        throw NotFound('User not found')
    }
    return user
}
const getByAddress = async (address: string): Promise<UserDocument> => {
    const user = await User.findOne({ address })
    if (!user) {
        throw NotFound('User not found')
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