const mongoose = require('mongoose');


//define the user schema
const withdrawalSchema = new mongoose.Schema({
    withdrawalMethod:{type:String,default:null},
   amount:{ type: String, default:0 },
   accountNumber:{ type: String, default:null },
   date:{ type: Date, default:Date.now() },
   status:{ type: String, default:'pending' },
   withdrawalfrom:{ type: mongoose.Schema.Types.ObjectId,ref: 'User',},
},
{ timestamps: true}
);




module.exports = mongoose.model('withdrawal', withdrawalSchema);