const mongoose = require('mongoose');

//define the user schema
const accountSchema = new mongoose.Schema({
    profit:{ type: String, default: null },
    bitcoinAddress:{ type: String, default: null },
    totalamount: { type: String, default: null },
   accountHolder:{ type: mongoose.Schema.Types.ObjectId,ref: 'User'},
},
{ timestamps: true},
)




module.exports = mongoose.model('Account', accountSchema);