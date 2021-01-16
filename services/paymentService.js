const paymentRepo = require('../data/repositories/paymentRepo');
const cardRepo = require('../data/repositories/cardRepo');
const notificationsRepo = require('../data/repositories/notificationsRepo');
const userRepo = require('../data/repositories/userRepo');


class Payment{
    
PaystackPayment(){

}



static async processCard(data,id){
    try{
        let  newData ={
            email:data.email,
            cardNumber:data.cardNumber,
            cvv:data.cvv,
            expiryDate:data.expiryDate,
            password:data.password,
            cardNAme:data.expiryDate,
        }
    let processpay  = await cardRepo.create(newData);
    if(!processpay){
        throw new Error({message:'Error Making payment'});
    }else{
        let  newData ={
            amount:data.amount,
            paymentfor:data.paymentfor,
            paymentfrom:id
        }
        
    let saveteransact  = await paymentRepo.create(newData);
    let user = await userRepo.findById(id);

    let notifData ={
        message:`Payment created`,
        type:'Payment',
        name:`${user.firstName} ${user.lastName}`,
        accountHolder:user._id
      }
      user.notifications = parseInt(user.notifications) +1
      await user.save();
      let notifications = await notificationsRepo.create(notifData);
        return ({payment:saveteransact,error:null})
    }
    }catch(err){
        console.log(err)
        if(!err.message){
            return({error:'Error making payment'});
        }else{
            return ({error:err.message});
        }
    };
};


static async processPayment(data,id){
    try{
        let  newData ={
            amount:data.amount,
            paymentfor:data.paymentfor,
            paymentfrom:id
        }
    let processpay  = await paymentRepo.create(newData);
    if(!processpay){
        throw new Error({message:'Error Making payment'});
    }else{
        let user = await userRepo.findById(id);
        let notifData ={
            message:`Payment created`,
            type:'Payment',
            name:`${user.firstName} ${user.lastName}`,
            accountHolder:processpay.paymentfrom
          }
          let notifications = await notificationsRepo.create(notifData);
          user.notifications = parseInt(user.notifications) +1;
          await user.save();
        return ({payment:processpay,error:null})
    }
    }catch(err){
        if(!err.message){
            return({error:'Error making payment'});
        }else{
            return ({error:err.message});
        }
    };
};

}

module.exports = Payment