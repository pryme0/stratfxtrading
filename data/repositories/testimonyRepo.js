const {testimonyModel} = require('../models/index');
const _ = require('lodash')

class testimonyRepo{
       static async create(userData) {
           console.log('got here');
        const user = await paymentModel.create(userData);
        return user;
    };
   
 

    
}

module.exports =testimonyRepo;

