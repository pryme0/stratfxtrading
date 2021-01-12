const {notificationModel} = require('../models/index');
const _ = require('lodash')

class notificationRepo{
       static async create(userData) {
        const user = await notificationModel.create(userData);
        return user;
    };
    static async updateOneById(profileId, data) {
        return notificationModel.findOneAndUpdate({ _id: profileId }, data, { new: true });
    }
    /**
     * @description A static method to find accounts linked to user
     * @param ID-the user social media id
     * @returns {Promise<UserModel>}
     */

    static async findById(userId) {
        return notificationModel.findById(userId).populate('accountHolder');
    }

    static async getAllNotifications(accountId) {
        try {
           let data  = await notificationModel.find({});
         
           return data
        } catch (err) {
          return err;
        }
      }
    static async findByUserId(accountId) {
        try {
           let data  = await notificationModel.find({ accountHolder: accountId });
           return data
        } catch (err) {
          return err;
        }
      }
  
}

module.exports =notificationRepo;

