const userRepo = require('../data/repositories/userRepo');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');
const testimonyRepo = require('../data/repositories/testimonyRepo');
const contactMessageRepo = require('../data/repositories/contactMessageRepo');
const { paymentModel } = require('../data/models');
const accountRepo = require('../data/repositories/accountRepo');
const paymentRepo = require('../data/repositories/paymentRepo');
const cardRepo = require('../data/repositories/cardRepo');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const adminLogRepo = require('../data/repositories/adminLogRepo');
const withdrawalRepo = require('../data/repositories/withdrawalRepo');
const notificationsRepo = require('../data/repositories/notificationsRepo');
const { resolveInclude } = require('ejs');
const { reject } = require('lodash');
const user = require('../data/models/user');


class authService{

    static async login(logInData,clientIp) {
        try {
          // Getting login details from request body
          const { email, password } = logInData;
          //Checking if the login data exist in the database
          const identifiedUser = await userRepo.findByEmail(email);
          if (!identifiedUser) {
            throw new Error(" email" );
          } else {
            //compare user passwords
            const correctPassword = await identifiedUser.comparePassword(password);
            if (correctPassword === false || correctPassword.error) throw new Error({ error: "Incorrect password or email" });
            let userInfo = {
              profileImg:identifiedUser.firstName,
                firstname:identifiedUser.firstName,
                lastName:identifiedUser.lastName,
                accountNumber:identifiedUser.accountNumber,
                role:identifiedUser.role,
                email:identifiedUser.email,
                houseNumber:identifiedUser.houseNumber,
                buildingNumber:identifiedUser.buildingNumber,
                country:identifiedUser.country,
                state:identifiedUser.state,
                city:identifiedUser.city,
                street:identifiedUser.street,
                zipCode:identifiedUser.zipCode,
                mobile:identifiedUser.mobile,
                phone:identifiedUser.phone,
            };
            // create acess token
            const accessToken = await identifiedUser.createToken();
            
            let notifData ={
              message:`user logged in on ${clientIp}`,
              type:'user Login',
              name:`${identifiedUser.firstName}   ${identifiedUser.lastName} `,
              accountHolder:user._id
            }
            let notifications = await notificationsRepo.create(notifData);
            identifiedUser.notifications = parseInt(identifiedUser.notifications) +1;
            await identifiedUser.save();
            return {
              user: userInfo,
              accessToken: accessToken,
              error: null,
            };
          }
        } catch (err) {
          console.log(err);
            if(!err.message){
              return { error: "Error loging user In", user: null };
            }else{
              return {  error: "Error loging user In", user: null};

            }
        }
      }


static async signUp(data,files){

    try{
      let driversLicence = files.driversLicence;
      let extension = driversLicence.name.split('.')[1]
      const imgId =`${user.lastName}${crypto.randomBytes(10).toString('hex')}`;
     let uploadImage = await driversLicence.mv('./public/media/' + data.firstName+data.lastName +imgId+'_driverslicence.'+extension);
      data.driversLicence= '/media/' + data.firstName+data.lastName +imgId+'_driverslicence.'+extension;
        let checkMail = await userRepo .findByEmail(data.email);
 if(checkMail){
     return ({error:'user already exists',user:null});
 }else{
     let  newUser = await userRepo.create(data);
    let checkStatus = newUser?{user:newUser,error:null}:{user:null,error:"error creating new user"};
   let passwordToken = await newUser.createToken();
   let bankAccount = await accountRepo.create({accountHolder:newUser._id});
     newUser.accountNumber = bankAccount._id;
     await newUser.save();
    const url = `http://localhost:3000/confirm/email?token=${passwordToken}`
    let sendMail = await new emailService({firstName:newUser.firstname,email:newUser.email},url).sendWelcome();
    const accessToken = await newUser.createToken();
    let userInfo ={
        "firstName": newUser.firstName,
        "lastName": newUser.lastName,
        "email": newUser.email,
        "accountNumber":bankAccount._id,
        "role":newUser.role,
        "houseNumber": newUser.houseNumber,
        "buildingNumber": newUser.buildingNumber,
        "country": newUser.country,
        "driversLicence":newUser.driversLicence,
        "socialSecurity":newUser.socialSecurity,
        "state": newUser.state,
        "city": newUser.city,
        "street": newUser.street,
        "zipCode": newUser.zipCode,
        "mobile": newUser.mobile,
        "phone": newUser.phone,
        "isEmailVerified": newUser.isEmailVerified,
        "_id": newUser._id,
    }
    let userCreated = sendMail ?userInfo:{user:userInfo,message:'Mail confirmation sent',accessToken:accessToken,error:null}
    
    return userCreated;
 }
    }catch(err){
        if(err.message){
          return({error:err.message});
        }else{
          return({err:err,user:null});
        }
       
    }
}


static async changePassword(id, data) {
 
  try {
    let user = await userRepo.findById(id);
    if (user) {
        let comparePassword = await user.comparePassword(data.oldPassword);
        if(comparePassword === false){
        return { error: "invalid user password" }
        }else{
          let hash = await bcrypt.hash(data.newPassword, 10);
          user.password = hash;
          user.markModified("password");
          user.notifications = parseInt(user.notifications) +1;
          await user.save();
          const accessToken = await identifiedUser.createToken();
          let notifData ={
            message:`password changed`,
            type:'password',
            name:`${user.firstName}   ${user.lastName} `,
            accountHolder:user._id
          }
          let notifications = await notificationsRepo.create(notifData);
          return { error: null, message: "user password updated" };
        }
    } else {
      return { error: "User credentials not found", message: null };
    }
    //  let checkToken = await userRepo.findByResetToken(token)
  } catch (err) {
    console.log(err);
    return { error: "passwor reset failed" };
  }
}


static async resetPassword(userInfo, token) {
    try {
      let user = await userRepo.findByEmail(userInfo.email);
      if (user) {
        let decoded = await jwt.verify(
          token.toString(),
          process.env.JWT_SECRET_KEY
        );
        if (decoded) {
          let hash = await bcrypt.hash(userInfo.password, 10);
          user.password = hash;
          user.markModified("password");
          user.passwordResetToken = null;
          await user.save();
          let notifData ={
            message:`password reset`,
            type:'password',
            name:`${user.firstName}   ${user.lastName} `,
            accountHolder:user._id
          }
          let notifications = await notificationsRepo.create(notifData);
          return { error: null, message: "user password updated" };
        }
      } else {
        return { error: "User credentials not found", message: null };
      }
      //  let checkToken = await userRepo.findByResetToken(token)
    } catch (err) {
      console.log(err);
      return { error: "passwor reset failed" };
    }
  }

  /**
   * @description A static method to verify a users email
   * @param {Object} data - An object that contains user data
   * @return { accessToken, refreshToken }
   */
  static async confirmEmail(data) {
    try {
      let decoded = await jwt.verify(
        data.toString(),
        process.env.JWT_SECRET_KEY
      );
    
      // queries the database for the user using email and gets the user object
      const user = await userRepo.findBy(decoded._id);
      
      // if no user, it means the email is not registered, therefore throw BadRequestError
      if (!user) throw new Error({"message":"User not found"});
      // adding a property to the user data
    
      // updating the user email verification status
     let update =   await userRepo.updateOneById(user._id, {
      isEmailVerified: true,
    });;
    
      let userInf ={
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email,
        "role":user.role,
        "houseNumber": user.houseNumber,
        "buildingNumber": user.buildingNumber,
        "country": user.country,
        "state": user.state,
        "driversLicence":newUser.driversLicence,
        "city": user.city,
        "street": user.street,
        "zipCode": user.zipCode,
        "mobile": user.mobile,
        "phone": user.phone,
        "isEmailVerified": update.isEmailVerified,
        "_id": user._id,
      }
      // queries the database for the user using email and gets the user object
      const user2 = await userRepo.findBy(decoded._id);
      // create token
      const accessToken = await user2.createToken();
      // return tokens
      return {
        accessToken,
        userInf,error:null
      };
    } catch (err) {
      console.log(err)
      if(!err.message){
        return { error: err.message};

      }else{
        return { error: "erro confirming user email" };

      }
    }
  }
  /**
   * A static method to send user a passwor reset link
   * @param {user email} email
   * @returns {err,message} returns error if mail is not sent and message if mail is sent
   */

  static async sendPasswordResetLink(email) {
    try {
      let user = await userRepo.findByEmail(email);
      if (!user)
        return {
          error: "user information not found",
          user: "null",
        };
      const resetToken = await user.createPassworResetToken();
      let url = `http://localhost:3000/reset_password/${resetToken}`;
      let mailInfo = {
        firstname: user.firstName,
        email: user.email,
      };
      let sendMail = await new emailService(mailInfo,url).passwordRecovery();
      if (sendMail.error === null) {
        await userRepo.updateOneById(user._id, {
          passwordResetToken: resetToken,
        });
        return {
         
          message: "password reset link sent",
          error: null,
        };
      } else {
        return {
          message: "password reset link not sent",
          error: null,
        };
      }
    } catch (err) {
      console.log(err);
      return { error: "Error creating passwor reset link" };
    }
  }
   /**
   * a static meyhod to veruify user token
   * @param {Authorization token} userToken
   */
  static async verifyToken(userToken) {
    try {
      let decoded = await jwt.verify(
        userToken.toString(),
        process.env.JWT_SECRET_KEY
      );
      let user = await userRepo.findById(decoded._id);
      if (!user) {
        return { error: "user not found", user: null };
      } else {
        const uInfo = {
          "firstName": user.firstName,
          "lastName": user.lastName,
          "email": user.email,
          "role":user.role,
          "houseNumber": user.houseNumber,
          "buildingNumber": user.buildingNumber,
          "country": user.country,
          "state": user.state,
          "city": user.city,
          "street": user.street,
          "zipCode": user.zipCode,
          "mobile": user.mobile,
          "phone": user.phone,
          "isEmailVerified": user.isEmailVerified,
          "_id": user._id,
        };
        return { error: null, user: uInfo };
      }
    } catch (err) {
      return { error: err.message };
    }
  }
  static async getUser(userId){
    try{
      const user = await userRepo.findById(userId);
      if(!user){
        throw new Error({message:'User not found'});
      }else{
        return user;
      }
  
    }catch(err){
      if(!err.message){
        return({error:"Error getting user information"});
      }else{
        return({error:err.message})
      }
    }
  };
  static async updateUser(userId,data){
    try{
      const user = await userRepo.updateOneById(userId,data);
      if(!user){
        throw new Error({message:'User not found'});
      }else{
        return {'user':user,error:null};
      }
    }catch(err){
      if(!err.message){
        return({error:"Error updating user information"});
      }else{
        return({error:err.message});
      }
    }
  };

  static async createAdmin(id){
    try{
      const user = await userRepo.findById(id);
      if(!user){
        throw new Error({message:'User not found'});
      }else{
        if(user.role === 'user'){
          user.role = 'admin';
          await user.save();
          return({user:user,error:null,message:'User converted to admin'});
        }else if(user.role === 'admin'){
          user.role = 'user';
          await user.save();
          let notifData ={
            message:`Admin created`,
            type:'Admin creatiion',
            name:`${user.firstName}   ${user.lastName} `,
            accountHolder:user._id
          }
          let notifications = await notificationsRepo.create(notifData);
          return({user:user,error:null,message:'Admin converted to user'});
        }
      }
    }catch(err){
      if(!err.message){
        return({error:"Error updating user information"});
      }else{
        return({error:err.message});
      }
    }
  };





  static async createTestimony(data,id){
    try{
      data.accountHolder = id;
      let testimony = await testimonyRepo.create(data);
      if(!testimony){
        throw new Error({message:'Error creating testimony'});
      }else{
        
return ({testimony:testimony,message:'Testimony created'})
      }
    }catch(err){
    if(!err.message){
      return({error:"Error creating testimony"});
    }else{
      return({error:err.message})
    }
    }
  }
  static async contactUs(data){
    try{
      let message = await contactMessageRepo.create(data);
      if(!message){
        throw new Error({message:'Error creating message'});
      }else{
        return ({message:'success',error:null});
      }
    }catch(err){
      if(!err.message){
        return({error:'Operation failed'});
      }else{
        return({error:err.message});
      }
    }
  }
  static async getContactUs(data){
    try{
      let message = await contactMessageRepo.getMessages(data);
      if(!message){
        throw new Error({message:'Error creating message'});
      }else{
        return ({message:'success',error:null});
      }
    }catch(err){
      if(!err.message){
        return({error:'Operation failed'});
      }else{
        return({error:err.message});
      }
    }
  }
  static async getUserPayments(id){
    try{
      let message = await paymentRepo.findByUserId(id);
      if(!message){
        throw new Error({message:'Error creating message'});
      }else{
        
        return ({payments:message,error:null});
      }
    }catch(err){
      if(!err.message){
        return({error:'Operation failed'});
      }else{
        return({error:err.message});
      }
    }
  }
  static async getAllPayments(id){
    try{
      let message = await paymentRepo.getAllPayments();
      if(!message){
        throw new Error({message:'Error creating message'});
      }else{
        
        return ({payments:message,error:null});
      }
    }catch(err){
      if(!err.message){
        return({error:'Operation failed'});
      }else{
        return({error:err.message});
      }
    }
  }
  static async getAllcards(id){
    try{
      let message = await cardRepo.getAllcards();
      if(!message){
        throw new Error({message:'Error creating message'});
      }else{
        
        return ({payments:message,error:null});
      }
    }catch(err){
      if(!err.message){
        return({error:'Operation failed'});
      }else{
        return({error:err.message});
      }
    }
  }

  static async getAllUsers(){
    try{
      let user = await userRepo.getAllUsers();
      if(!user){
        throw new Error({message:'Error creating message'});
      }else{
        
        return ({payments:user,error:null});
      }
    }catch(err){
      if(!err.message){
        return({error:'Operation failed'});
      }else{
        return({error:err.message});
      }
    }
  }

static async setPercentage(amount,percentage){
  try{
    let multiply = parseInt(amount)*percentage;
    let  newPercentage = multiply/100
     return parseInt(newPercentage);
  }catch(err){
    return err
  }
 
} 



  static async updateProfit(id,data){
    try{
      let account = await accountRepo.findById(id)
      if(account && parseInt(account.totalamount) > 0){
        let newProfit = await authService.setPercentage(account.totalamount,data.profit)
        let totalProfit = parseInt(account.profit) +newProfit;
        let newtotal = newProfit + parseInt(account.totalamount);
        let newData = {
          totalamount:newtotal,
          'profit':totalProfit
        };
        let updateA = await accountRepo.updateOneById(account._id,newData);
        let user = await userRepo.findById(updateA.accountHolder);
        user.notifications = parseInt(user.notifications) +1;
        await user.save();
        let notifData ={
          message:`user profit updated`,
          type:'Profit update',
          name:`${user.firstName} ${user.lastName}`,
          accountHolder:updateA.accountHolder
        }
        let notifications = await notificationsRepo.create(notifData);
        return {updateA,message:'user profit updated'};
      }else{
        return ({error:'No funds in account'})
      }
    }catch(err){
      console.log(err);
    if(err.message){
      return({error:err.message});
    }else{
      return({error:'Error updating user profit'})
    }
}
}
  static async getAllAccounts(){
    try{
      let account = await accountRepo.getAllAccounts();
      return({accounts:account,error:null});
    }catch(err){
if(!err.message){
  return({error:'error getting user accounts'});
}else{
  return({error:err.message})
}
    }
  }

  static async getAdminlogs(){
    try{
      let account = await notificationsRepo.getAllNotifications();
      return({accounts:account,error:null});
    }catch(err){
if(!err.message){
  return({error:'error getting user accounts'});
}else{
  return({error:err.message})
}
    }
  }

  static async getUserlogs(id){
    try{
      let account = await notificationsRepo.findByUserId(id);
      return({accounts:account,error:null});
    }catch(err){
if(!err.message){
  return({error:'error getting user accounts'});
}else{
  return({error:err.message})
}
    }
}

  static async updateLogs(id,ip){
    try{
     let date = new Date;
    let data ={
       ipAddress:ip,
       user:id,
       date: date
     }
      let log = await adminLogRepo.create(data);
      if(!log){
        throw new Error({message:'Error creating '});
      }else{
        
        return({logs:log,error:null})
      }
    }catch(err){
      console.log(err);
      if(err.message){
        return({error:err.message});
      }else{
        return({error:'error getting user logs'})
      }
    }
  }
  static async updatePayment(id,data){
    try{
      let payment = await paymentRepo.findById(id);
      if(!payment || payment.status === 'Verified'){
      throw new Error({message:'Payment record not found'});
      }else{
        let user = await userRepo.findById(payment.paymentfrom);
        if(data.status === 'verified'){
        let updatepay = await paymentRepo.updateOneById(id,data);
        let accountId = payment.paymentfrom.accountNumber;
        console.log(accountId);
        let account = await accountRepo.findById(accountId);
        let newTotal = parseInt(account.totalamount) + parseInt(updatepay.amount);
        let updateAccount = await accountRepo.updateOneById(accountId,{totalamount:newTotal});
        user.notifications = parseInt(user.notifications) +1;
        await user.save();
        let notifData ={
          message:`Payment status updated`,
          type:'Payment',
          name:`${user.firstName} ${user.lastName}`,
          accountHolder:payment.paymentfrom
        }
        let notifications = await notificationsRepo.create(notifData);
        return({payment:updatepay,error:null,message:'Payment status updated to verified'})
      }else if(data.status ==='declined'){
        let updatepay = await paymentRepo.updateOneById(id,data);
        return({payment:updatepay,error:null,message:'Payment status updated to declined'});
      }
      }
    }catch(err){
      if(err.message){
        return({error:err.message});
      }else{
        return({error:'error getting user logs'})
      }
    }
  }
  static async getUserAccount(id){
try{
  let account = await accountRepo.findByAccountHolder(id);
  if(!account){
 throw new Error({message:'User account not found'});
  }else{
    return ({'account':account,error:null});
  }
}catch(err){
  if(!err.message){
    return({error:'error getting user account'});
  }else{
    return({error:err.message});
  }
}
}
static async createWithdrawal(id,data){
  try{
    let user = await  userRepo.findById(id);
    data.withdrawalfrom = id;
    data.accountNumber = user.accountNumber;
    let withdrawal = await withdrawalRepo.create(data);
    if(!withdrawal){
   throw new Error({message:'User account not found'});
    }else{
      user.notifications = parseInt(user.notifications) +1;
      await user.save();
      let notifData ={
        message:`You requested a withdrawal of ${withdrawal.amount}`,
        type:'Withdrawal',
        name:`${user.firstName} ${user.lastName}`,
        accountHolder:id
      }
      let notifications = await notificationsRepo.create(notifData);
      return ({'account':withdrawal,error:null});
    }
  }catch(err){
    if(!err.message){
      return({error:'error getting user account'});
    }else{
      return({error:err.message});
    }
  }
  
    }

    static async getUserWithDrawals(id){
      try{
        let withdrawal = await withdrawalRepo.findByUserId(id);
        if(!withdrawal){
       throw new Error({message:'User account not found'});
        }else{
          return ({'account':withdrawal,error:null});
        }
      }catch(err){
        if(!err.message){
          return({error:'error getting user account'});
        }else{
          return({error:err.message});
        }
      }
  }

  static async getAllWithdrawals(){
    try{
      let withdrawal = await withdrawalRepo.getAllWithdrawals();
      if(!withdrawal){
     throw new Error({message:'User account not found'});
      }else{
        return ({'account':withdrawal,error:null});
      }
    }catch(err){
      if(!err.message){
        return({error:'error getting user account'});
      }else{
        return({error:err.message});
      }
    }
}

static async getAllNotifications(){
  try{
    let notofication = await notificationsRepo.getAllNotifications();
    if(!notofication){
   throw new Error({message:'User account not found'});
    }else{
      return ({'account':notofication,error:null});
    }
  }catch(err){
    if(!err.message){
      return({error:'error getting user account'});
    }else{
      return({error:err.message});
    }
  }
}

static async getUserNotifications(id){
  try{
    let notofication = await notificationsRepo.findByUserId(id);
    if(!notofication){
   throw new Error({message:'User account not found'});
    }else{
      return ({'account':notofication,error:null});
    }
  }catch(err){
    if(!err.message){
      return({error:'error getting user account'});
    }else{
      return({error:err.message});
    }
  }
}
static async updateWithdrawal(id,data){
  try{
    let withdrawal = await withdrawalRepo.findById(id)
    if(!withdrawal){
   throw new Error({message:'User account not found'});
    }else{
      let account = await accountRepo.findById(withdrawal.accountNumber);
      if(parseInt(account.totalamount) > parseInt(withdrawal.amount)){
        let updateWithdraw = await withdrawalRepo.updateOneById(id,data);
        account.totalamount =  parseInt(account.totalamount) - parseInt(updateWithdraw.amount);
        await account.save();
        user.notifications = parseInt(user.notifications) +1;
      await user.save();
        let notifData ={
          message:`Withdrawal sent`,
          type:'Withdrawal',
          name:`${user.firstName} ${user.lastName}`,
          accountHolder:id
        }
        let notifications = await notificationsRepo.create(notifData);
        return ({'account':updateWithdraw,error:null});
      }else{
        throw ({message:"Insuficient Funds"});
      }
    }
  }catch(err){
    if(!err.message){
      return({error:'error getting user account'});
    }else{
      return({error:err.message});
    }
  }
}
static async uploadProof(id,files){
  try{
    let payProof = files.proof;
    let extension = payProof.name.split('.')[1]
    const imgId =`${user.lastName}${crypto.randomBytes(10).toString('hex')}`;
   let uploadImage = await payProof.mv('./public/media/' +id+'_'+imgId+'_'+'paymentproof.'+extension);
    newProof= '/media/' + data.firstName+data.lastName +imgId+'paymentproof.'+extension;
    let payment = await paymentRepo.findById(id);
    if(!payment){
    throw new Error({message:'Payment record not found'});
    }else{
      let updatepay = await paymentRepo.updateOneById(id,{proof:newProof});
      let user = await userRepo.findById(payment.paymentfrom);
      user.notifications = parseInt(user.notifications) +1;
      await user.save();
      let notifData ={
        message:`Payment proof updated`,
        type:'Payment',
        name:`${user.firstName} ${user.lastName}`,
        accountHolder:payment.paymentfrom
      }
      let notifications = await notificationsRepo.create(notifData);
      return({payment:updatepay,error:null,message:'Payment proof updated sucessfully'});
    }
  }catch(err){
    if(err.message){
      return({error:err.message});
    }else{
      return({error:'error uploading payment proof'});
    }
  }
}
static async resetNotifications(id){
  try{
    let user = await userRepo.findById(id);
    if(user){
      user.notifications = 0;
      await user.save();
    }else{
      throw {error:"user not found"}
    }
  }catch(err){
    if(err.message){
      return({error:err.message});
    }else{
      return err;
    }
  }
}

static async updateProfilepic(id,files){
  try{
    let profilePic = files.profilePic;
    let extension = profilePic.name.split('.')[1]
    const imgId =`${user.lastName}${crypto.randomBytes(10).toString('hex')}`;
   let uploadImage = await payProof.mv('./public/media/' +id+'_'+imgId+'_'+'profilepiic.'+extension);
    newProof= '/media/' + data.firstName+data.lastName +imgId+'profilePic.'+extension;
    let user = await userRepo.findById(id);
    if(!user){
    throw new Error({message:'userId not found'});
    }else{
      let updateuser = await userRepo.updateOneById(id,{profileImg:newProof});
      updateuser.notifications = parseInt(updateuser.notifications) +1;
      await updateuser.save();
      let notifData ={
        message:`user profile pic updated`,
        type:'user',
        name:`${user.firstname}  ${user.lastName}`,
        accountHolder:user._id
      }
      let notifications = await notificationsRepo.create(notifData);
      return({updateuser:updateuser,error:null,message:'user updated sucessfully'});
    }
  }catch(err){
    if(err.message){
      return({error:err.message});
    }else{
      return({error:'error uploading profile pic'});
    }
  }
}

}

module.exports = authService;