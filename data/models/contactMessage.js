const mongoose = require('mongoose');


//define the user schema
const contactMessageSchema = new mongoose.Schema({
    paymentfor: { type: String},
   amount:{ type: String, default:null },
   date:{ type: Date, default:Date.now() },
   status:{ type: String, default:'pending' },
   paymentfrom:{ type: mongoose.Schema.Types.ObjectId,ref: 'User',},
},
{ timestamps: true}
);




module.exports = mongoose.model('ContactMessage', contactMessageSchema);