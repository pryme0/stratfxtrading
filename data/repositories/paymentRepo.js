const {paymentModel} = require('../models/index');
const _ = require('lodash')

class paymentRepo{
    static async findByPayment(payee) {
        let model = await paymentModel.findOne({paymentfrom:payee});
       return model
       };
       static async create(userData) {
        const user = await paymentModel.create(userData);
        return user;
    };
    static async updateOneById(profileId, data) {
        return paymentModel.findOneAndUpdate({ _id: profileId }, data, { new: true });
    }
    /**
     * @description A static method to find accounts linked to user
     * @param ID-the user social media id
     * @returns {Promise<UserModel>}
     */

    static async findById(userId) {
        return paymentModel.findById(userId).populate('paymentfrom');
    }

    static async getAllPayments(accountId) {
        try {
           let data  = await paymentModel.find({}).populate('paymentfrom');
         
           return data
        } catch (err) {
          return err;
        }
      }
    static async findByUserId(accountId) {
        try {
           let data  = await paymentModel.find({ paymentfrom: accountId }).populate('paymentfrom');
           return data
        } catch (err) {
          return err;
        }
      }
  
}

module.exports =paymentRepo;

