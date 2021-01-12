const userModel = require('../models/user')
const cardModel = require('../models/card');
const paymentModel = require('../models/payment')
const testimonyModel = require('../models/testimony');
const contactMessageModel = require('../models/contactMessage');
const accountModel = require('../models/Account');
const adminLogModel = require('../models/adminlog');
const notificationModel = require('../models/notificaton.js');
const withdrawalModel = require('../models/withdrawal');

module.exports = {
    notificationModel,
    withdrawalModel,
    adminLogModel,
    accountModel,
    testimonyModel,
    userModel,
    cardModel,
    paymentModel,
    contactMessageModel
}