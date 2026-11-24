import User from '../models/user.model.js'

class UserRepository {
    async create(userData) {
        return await User.create(userData)
    }

    async getByEmail(email) {
        return await User.findOne({ email: email.toLowerCase() })
    }

    async getById(userId) {
        return await User.findById(userId)
    }

    async updateById(userId, updateData) {
        return await User.findByIdAndUpdate(userId, updateData, { new: true })
    }
}

const user_repository = new UserRepository()
export default user_repository
