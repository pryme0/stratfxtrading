const {adminLogModel} = require('../models/index')
const _ = require('lodash')

class adminLogRepo{
       static async create(userData) {
        const user = await adminLogModel.create(userData);
        return user;
    };
    static async updateOneById(profileId, data) {
        return adminLogModel.findOneAndUpdate({ accountHolder:profileId }, data, { new: true })
    }

    static async getAllAccounts() {
        const user = await adminLogModel.find({});
        return user;
    };
    static async getUserLogs(id) {
        const user = await adminLogModel.find({accountHolder:id});
        return user;
    };

    /**
     * @description A static method to find accounts linked to user
     * @param ID-the user social media id
     * @returns {Promise<UserModel>}
     */

    static async findById(userId) {
        return adminLogModel.findById(userId)
    }
    static async findByAccountHolder(userId) {
        return adminLogModel.find({accountHolder:userId});
    }
}

module.exports =adminLogRepo;

