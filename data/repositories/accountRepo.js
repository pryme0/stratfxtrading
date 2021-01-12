const {accountModel} = require('../models/index')
const _ = require('lodash')

class accountRepo{
       static async create(userData) {
        const user = await accountModel.create(userData);
        return user;
    };
    static async updateOneById(profileId, data) {
        return accountModel.findOneAndUpdate({ _id: profileId }, data, { new: true }).populate('accountHolder');
    }

    static async getAllAccounts() {
        const user = await accountModel.find({}).populate('accountHolder');
        return user;
    };
    /**
     * @description A static method to find accounts linked to user
     * @param ID-the user social media id
     * @returns {Promise<UserModel>}
     */

    static async findById(userId) {
        return accountModel.findById(userId);
    }
    static async findByAccountHolder(userId) {
        return accountModel.find({accountHolder:userId}).populate('accountHolder');
    }
}

module.exports =accountRepo;

