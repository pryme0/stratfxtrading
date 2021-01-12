const asyncHandler = require('../helpers/asyncHandler');
const authService = require('../services/authServices');
const paymentService = require('../services/paymentService');
const requestIp = require('request-ip')

module.exports ={
     Login: asyncHandler(async (req, res) => {
    let data = req.body;
    const clientIp = requestIp.getClientIp(req);
    let result = await authService.login(data,clientIp);
    if(result.error !== null){
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  }),
  /**
   * Route for local signup
   */
  signUp: asyncHandler(async (req, res) => {
    let user = await authService.signUp(req.body);
    if(user.error !== null){
      return res.status(400).json(user);
    }else{
      return res.status(200).json(user);

    }
  }),
  verifyToken: asyncHandler(async (req, res) => {
    const token = req.query.token
    let user = await authService.verifyToken(token)
    if (user.error !== null) {
      return res.status(400).json(user)
    } else {
      return res.status(200).json(user)
    }
  }),
  resetPassword: asyncHandler(async (req, res) => {
    let userInfo = req.body
    const token = req.query.token
   
    let resetPassword = await authService.resetPassword(userInfo,token)
    if (resetPassword.error !== null) {
      return res.status(400).json(resetPassword)
    } else {
      return res.status(200).json(resetPassword)
    }
  })
  ,
  changePassword: asyncHandler(async (req, res) => {
    let data = req.body;
    let id = "5fdb27aefc764518a070c0a6";
    let resetPassword = await authService.changePassword(id,data)
    if (resetPassword.error !== null) {
      return res.status(400).json(resetPassword)
    } else {
      return res.status(200).json(resetPassword)
    }
  }),
  resetPasswordLink: asyncHandler(async (req, res) => {
    let userMail = req.body.email
    let sendLink = await authService.sendPasswordResetLink(userMail)
    if (sendLink.error !== null) {
      return res.status(400).json('password reset failed')
    } else {
      return res.status(200).json(sendLink.message)
    }
  }),
  confirmEmail:asyncHandler(async (req, res) => {
    const token = req.query.token
    let user = await authService.confirmEmail(token)
    if (user.error !== null) {
    
      return res.status(500).json(user)
    } else {
      return res.status(200).json(user)
    }
  }),
  createPayment:asyncHandler(async(req,res)=>{
    let data = req.body;
    let id = req.user.id;
    const payment = await paymentService.processPayment(data,id);
    if(!payment.error){
      return res.status(200).json(payment);
    }else{
      return res.status(501).json(payment);
    }
  })
  ,getUser:asyncHandler(async(req,res)=>{
    let userId = req.user.id;
    let usrInfo = await authService.getUser(userId);
    if(!usrInfo.error){
      return res.status(200).json(usrInfo);
    }else{
      return res.status(400).json(usrInfo);
    }
  })
  ,updateUser:asyncHandler(async(req,res)=>{
    let userId = req.user.id;
    const data = req.body;
    let usrInfo = await authService.updateUser(userId,data);
    if(!usrInfo.error){
      return res.status(200).json(usrInfo);
    }else{
      return res.status(502).json(usrInfo);
    }
  }),
  createTesimony:asyncHandler(async(req,res)=>{
let id = req.user.id;
let data = req.body;
let testimony = await authService.createTestimony(data,id);
testimony.error?res.status(501).json(testimony.error):res.status(200).json(testimony);

  })
  ,
  contactUs:asyncHandler(async(req,res)=>{
let data = req.body;
let contact = await authService.contactUs(data);
contact.error?res.status(501).json(contact.error):res.status(200).json(contact);
  })
  ,
  getContactUs:asyncHandler(async(req,res)=>{
let id = req.user.id;
let data = req.body;
let testimony = await authService.getContactUs(data,id);
testimony.error?res.status(501).json(testimony.error):res.status(200).json(testimony);
  })
  ,
  getTransactions:asyncHandler(async(req,res)=>{
let id = req.user.id;
let data = req.body;
let testimony = await authService.getUserPayments(id);
testimony.error?res.status(501).json(testimony.error):res.status(200).json(testimony);
  }),
  getAllTransactions:asyncHandler(async(req,res)=>{
    let id = req.user.id;
    let data = req.body;
    let testimony = await authService.getAllPayments();
    testimony.error?res.status(501).json(testimony.error):res.status(200).json(testimony);
      }),
      getAllcards:asyncHandler(async(req,res)=>{
        let id = req.user.id;
        let data = req.body;
        let testimony = await authService.getAllcards();
        testimony.error?res.status(501).json(testimony.error):res.status(200).json(testimony);
          })
          ,
          createCardPayment:asyncHandler(async(req,res)=>{
            let data = req.body;
            let id = req.user.id;
            const payment = await paymentService.processCard(data,id);
            if(!payment.error){
              return res.status(200).json(payment);
            }else{
              return res.status(501).json(payment);
            }
          }) ,
          getAlluser:asyncHandler(async(req,res)=>{
            let id = req.user.id
            const payment = await authService.getAllUsers();
            if(!payment.error){
              return res.status(200).json(payment);
            }else{
              return res.status(501).json(payment);
            }
          }),
          updateProfit:asyncHandler(async(req,res)=>{
            let id = req.query.id
            data = req.body;
            const update = await authService.updateProfit(id,data);
            if(!update.error){
              return res.status(200).json(update);
            }else{
              return res.status(501).json(update);
            }
          }),
          createAdmin:asyncHandler(async(req,res)=>{
            let id = req.query.id
            const update = await authService.createAdmin(id);
            if(!update.error){
              return res.status(200).json(update);
            }else{
              return res.status(501).json(update);
            }
          })
          ,
          updateLogs:asyncHandler(async(req,res)=>{
            let id = req.user.id
            let ipAddress = req.connection.remoteAddress;
            const update = await authService.updateLogs(id,ipAddress);
            if(!update.error){
              return res.status(200).json(update);
            }else{
              return res.status(501).json(update);
            }
          }),
          getAdminLogs:asyncHandler(async(req,res)=>{
            let id = req.user.id;
            const update = await authService.getAdminlogs();
            if(!update.error){
              return res.status(200).json(update);
            }else{
              return res.status(501).json(update);
            }
          })
          ,
          getUserLogs:asyncHandler(async(req,res)=>{
            let id = req.user.id;
            const update = await authService.getUserlogs(id);
            if(!update.error){
              return res.status(200).json(update);
            }else{
              return res.status(501).json(update);
            }
          })
          ,
          getAllAccounts:asyncHandler(async(req,res)=>{
            let id = req.user.id
            data = req.body;
            const update = await authService.getAllAccounts();
            if(!update.error){
              return res.status(200).json(update);
            }else{
              return res.status(501).json(update);
            }
          })
          ,
          updatePayment:asyncHandler(async(req,res)=>{
            let id = req.query.id;
            data = req.body;
            const update = await authService.updatePayment(id,data);
            if(!update.error){
              return res.status(200).json(update);
            }else{
              return res.status(501).json(update);
            }
          }),
          getUserAccount:asyncHandler(async(req,res)=>{
            let id = req.user.id
            const update = await authService.getUserAccount(id);
            if(!update.error){
              return res.status(200).json(update);
            }else{
              return res.status(501).json(update);
            }
          })
          ,
          createWithdrawal  :asyncHandler(async(req,res)=>{
            let id = req.user.id
            let data = req.body;
            const update = await authService.createWithdrawal(id,data);
            if(!update.error){
              return res.status(200).json(update);
            }else{
              return res.status(501).json(update);
            }
          })
          ,
          getUserWithdrawal:asyncHandler(async(req,res)=>{
            let id = req.user.id
            const update = await authService.getUserWithDrawals(id);
            if(!update.error){
              return res.status(200).json(update);
            }else{
              return res.status(501).json(update);
            }
          })
          ,
          getAllWithdrawals:asyncHandler(async(req,res)=>{
            console.log('here')
            let id = req.user.id
            const withdrawals = await authService.getAllWithdrawals();
            if(!withdrawals.error){
              return res.status(200).json(withdrawals);
            }else{
              return res.status(501).json(withdrawals);
            }
          })
          ,
          getAllNotofications:asyncHandler(async(req,res)=>{
            let id = req.user.id
            const update = await authService.getAllNotifications();
            if(!update.error){
              return res.status(200).json(update);
            }else{
              return res.status(501).json(update);
            }
          })
          ,
          getUserNotification:asyncHandler(async(req,res)=>{
            let id = req.user.id
            const update = await authService.getUserNotifications(id);
            if(!update.error){
              return res.status(200).json(update);
            }else{
              return res.status(501).json(update);
            }
          })
          ,
          updateWithdrawal:asyncHandler(async(req,res)=>{
            let id = req.query.id
            let data = req.body;
            const update = await authService.updateWithdrawal(id,data);
            if(!update.error){
              return res.status(200).json(update);
            }else{
              console.log(update)
              return res.status(400).json(update);
            }
          })
          ,
          uploadPaymentProof:asyncHandler(async(req,res)=>{
            console.log('here')
            let id = req.query.id
            let data = req.files;
            let getImageName = data[0].path.split('/');
            let filepath =`/media/${getImageName[2]}`
            const update = await authService.uploadProof(id,filepath);
            if(!update.error){
              return res.status(200).json(update);
            }else{
              return res.status(501).json(update);
            }
          })
          ,
          updateProfilepic:asyncHandler(async(req,res)=>{
            let id = req.user.id
            let data = req.files;
            let getImageName = data[0].path.split('/');
            let filepath =`/media/${getImageName[2]}`
            const update = await authService.updateProfilepic(id,filepath);
            if(!update.error){
              return res.status(200).json(update);
            }else{
              return res.status(501).json(update);
            }
          })
}