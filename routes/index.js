var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const jsonToken = require('../validation/jsonwebtoken');




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//Route to sign users up
router.post('/oauth/signup', userController.signUp);
//Route to log users in
router.post('/oauth/login', userController.Login);
//Route to create payment
router.post('/oauth/createPayment',jsonToken.verifyToken, userController.createPayment);
//Route to getUserDetails
router.get('/oauth/getuser',jsonToken.verifyToken, userController.getUser);
//Route to getUserDetails
router.post('/oauth/updateuser',jsonToken.verifyToken, userController.updateUser);
//Route to create refreshToken
router.get('/oauth/verifyToken', userController.verifyToken);
//Route to create refreshToken
router.get('/oauth/confirm/mail', userController.confirmEmail);
//Route to reset users password
router.post('/oauth/resetPasswordLink', userController.resetPasswordLink);
//Route to reset users password
router.post('/oauth/changePassword',jsonToken.verifyToken,  userController.changePassword);
/** Route to create tweets with media */
router.post('/oauth/updateProfilepic', jsonToken.verifyToken,userController.updateProfilepic);
//Route to reset users password
router.get('/oauth/getUserPayments',jsonToken.verifyToken, userController.getTransactions);
//Route to reset users password
router.get('/oauth/getAllPayments',jsonToken.verifyToken, userController.getAllTransactions);
//Route to reset users password
router.get('/oauth/getAllWithdrawal',jsonToken.verifyToken, userController.getAllWithdrawals);
//Route to reset users password
router.post('/oauth/updateWithdrawal',jsonToken.verifyToken, userController.updateWithdrawal);
//Route to reset users password
router.get('/oauth/getalluser',jsonToken.verifyToken, userController.getAlluser);
//Route to reset users password
router.get('/oauth/getAllCards',jsonToken.verifyToken, userController.getAllcards);
//Route to reset users password
router.post('/oauth/createCardPayment',jsonToken.verifyToken, userController.createCardPayment);

//Route to reset users password
router.post('/oauth/uploadproof',userController.uploadPaymentProof);
//Route to reset users password
//Route to reset users password
router.post('/oauth/createtestimony',jsonToken.verifyToken, userController.createTesimony);
//Route to reset users password
router.post('/oauth/contactUs', userController.contactUs);
//Route to reset users password
router.post('/oauth/resetPassword', userController.resetPassword);
//Route to reset users password
router.get('/oauth/saveLoginLog',jsonToken.verifyToken, userController.updateLogs);
//Route to reset users password
router.get('/oauth/getAdminLogs',jsonToken.verifyToken, userController.getAdminLogs);
router.get('/oauth/getAllAccounts',jsonToken.verifyToken, userController.getAllAccounts);
router.get('/oauth/getUserAccount',jsonToken.verifyToken, userController.getUserAccount);
router.get('/oauth/createAdmin',jsonToken.verifyToken, userController.createAdmin);
router.post('/oauth/updateProfit',jsonToken.verifyToken, userController.updateProfit);
router.post('/oauth/updatePayment',jsonToken.verifyToken, userController.updatePayment);

router.get('/oauth/getUserLogs',jsonToken.verifyToken, userController.getUserLogs);
router.get('/oauth/resetNotifications',jsonToken.verifyToken, userController.resetNotifications);
router.post('/oauth/updateDriversLicence',jsonToken.verifyToken, userController.updateDriversLicence);

router.get('/oauth/getPaymentMethods',jsonToken.verifyToken, userController.getPaymentMethods);
router.post('/oauth/createPaymentMethod',jsonToken.verifyToken, userController.createPaymentMethod);
router.post('/oauth/updatePaymentMethod',jsonToken.verifyToken, userController.updatePaymentMethod);




module.exports = router;
