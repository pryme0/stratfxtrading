const {withdrawalModel} = require('../models/index');
const _ = require('lodash')

class withdrawalRepo{
       static async create(userData) {
        const user = await withdrawalModel.create(userData);
        return user;
    };
    static async updateOneById(profileId, data) {
        return withdrawalModel.findOneAndUpdate({ _id: profileId }, data, { new: true });
    }
    /**
     * @description A static method to find accounts linked to user
     * @param ID-the user social media id
     * @returns {Promise<UserModel>}
     */

    static async findById(userId) {
        return withdrawalModel.findById(userId).populate('withdrawalfrom');
    }

    static async getAllWithdrawals(accountId) {
        try {
           let data  = await withdrawalModel.find({}).populate('withdrawalfrom');
         
           return data
        } catch (err) {
          return err;
        }
      }
    static async findByUserId(accountId) {
        try {
           let data  = await withdrawalModel.find({ withdrawalfrom: accountId }).populate('withdrawalfrom');
           return data
        } catch (err) {
          return err;
        }
      }
  
}

module.exports =withdrawalRepo;

