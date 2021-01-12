const mongoose = require('mongoose');


//define the user schema
const adminLogSchema = new mongoose.Schema({
    ipAddress:{ type: String,default: null},
    date:{type:Date,default:Date.now},
    user:{ type: mongoose.Schema.Types.ObjectId,ref: 'User'}
},{ timestamps: true},
)




module.exports = mongoose.model('AdminLog', adminLogSchema);