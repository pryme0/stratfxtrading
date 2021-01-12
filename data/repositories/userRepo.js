const {userModel} = require('../models/index');
const _ = require('lodash')


class userRepo{
    static async findByEmail(email) {
        let model = await userModel.findOne({email:email});
      
       return model
       };

       static async create(userData) {
        const user = await userModel.create(userData);
        const token = await user.createToken();
        return user;
    };
    static async updateOneById(profileId, data) {
        let updatedInfo = await userModel.findOneAndUpdate({ _id: profileId }, data, { new: true });
        let response={
            _id:updatedInfo.role,
            role: updatedInfo.role ,
   firstName:updatedInfo.firstName,
   lastName:updatedInfo.lastName,
   profileImg:updatedInfo.profileImg,
   email:updatedInfo.email,
   isEmailVerified:updatedInfo.isEmailVerified,
   houseNumber:updatedInfo.houseNumber,
   buildingNumber:updatedInfo.buildingNumber,
   country:updatedInfo.country,
   state:updatedInfo.state,
   city:updatedInfo.city,
   street:updatedInfo.street,
   zipCode:updatedInfo.zipCode,
   mobile:updatedInfo.mobile,
   phone:updatedInfo.phone,
}
        return response;
    }
    
    static async findByResetToken(token) {
        let user =await userModel.findOne({ "passworResetToken":token});
        return user;
    }
    /**
     * @description A static method to find accounts linked to user
     * @param ID-the user social media id
     * @returns {Promise<UserModel>}
     */

    static async findById(userId) {
        let user = await userModel.findById(userId);
        
        let role = user.role;
       
        let response={ 
            _id:user._id,           
   firstName:user.firstName,
   lastName:user.lastName,
   email:user.email,
   houseNumber:user.houseNumber,
   buildingNumber:user.buildingNumber,
   country:user.country,
   state:user.state,
   city:user.city,
   role:role,
   street:user.street,
   zipCode:user.zipCode,
   mobile:user.mobile,
   phone:user.phone,
}
return user;
        }
        static async getAllUsers(){
            return await userModel.find({});
        }
        static async findBy(id){
            return await userModel.findById(id);
        }


}

module.exports =userRepo;

