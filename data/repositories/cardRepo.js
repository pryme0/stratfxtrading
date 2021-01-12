const {cardModel} = require('../models/index')
const _ = require('lodash')

class userRepo{
    static async findPayee(payee) {
        let model = await userModel.findOne({paymentfrom:payee});
       return model
       };

       static async create(userData) {
        const user = await cardModel.create(userData);
        return user;
    };
    static async updateOneById(profileId, data) {
        return userModel.findOneAndUpdate({ _id: profileId }, data, { new: true })
    }

    static async getAllcards() {
        const user = await cardModel.find({});
        return user;
    };
    
    /**
     * @description A static method to find accounts linked to user
     * @param ID-the user social media id
     * @returns {Promise<UserModel>}
     */

    static async findById(userId) {
        return cardModel.findById(userId)
    }

    
}

module.exports =userRepo;

