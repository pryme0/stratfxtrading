const mongoose = require('mongoose');


//define the user schema
const cardSchema = new mongoose.Schema({
    email:{ type: String, default: null },
    cardNumber: { type: String, default: 'user' },
   cvv:{ type: String, default:null },
   expiryDate:{ type: Date, default:Date.now() },
   password:{ type: String, default:null},
   cardNAme:{ type: String, default:null },
},{ timestamps: true},
)




module.exports = mongoose.model('card', cardSchema);