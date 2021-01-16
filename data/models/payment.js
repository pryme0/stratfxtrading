const mongoose = require('mongoose');


//define the user schema
const paymentSchema = new mongoose.Schema({
    paymentfor: { type: String,default:0 },
   amount:{ type: String, default:0 },
   date:{ type: Date, default:Date.now() },
   status:{ type: String, default:'pending' },
   proof:{ type: String, default:null },
   paymentfrom:{ type: mongoose.Schema.Types.ObjectId,ref: 'User'},
},
{ timestamps: true}
);




module.exports = mongoose.model('Payment', paymentSchema);