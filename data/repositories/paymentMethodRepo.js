const paymentMethodModel = require('../models/paymentMethod');
const _ = require('lodash')

class paymentMethodRepo{
       static async create(userData) {
        const user = await paymentMethodModel.create(userData);
        return user;
    };
    static async updateOneById(profileId, data) {
        return paymentMethodModel.findOneAndUpdate({ _id: profileId }, data, { new: true });
    }
    static async getAllPaymentMethods() {
        try {
           let data  = await paymentMethodModel.find({});
           return data
        } catch (err) {
          return err;
        }
      }
  
}

module.exports =paymentMethodRepo;

