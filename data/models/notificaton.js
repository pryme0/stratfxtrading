const mongoose = require('mongoose');


//define the user schema
const notificationSchema = new mongoose.Schema({
    message:{type:String,default:null},
    accountHolder: { type: mongoose.Schema.Types.ObjectId,ref: 'User'},
    name:{type:'String',default:null},
    type:{type:'String',default:null},
    Date:{type:Date,default:Date.now}
},{ timestamps: true},
)




module.exports = mongoose.model('Notification', notificationSchema);