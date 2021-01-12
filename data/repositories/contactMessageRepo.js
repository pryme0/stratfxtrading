const {contactMessageModel} = require('../models/index');
const _ = require('lodash')

class contactMessageRepo{
       static async create(userData) {
        const message = await contactMessageModel.create(userData);
        return message;
    }; 
    static async getMessages() {
        const message = await contactMessageModel.find({});
        return message;
    }; 
}

module.exports =contactMessageRepo;

