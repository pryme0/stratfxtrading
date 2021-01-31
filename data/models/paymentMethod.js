const mongoose = require('mongoose');


//define the user schema
const paymentMethodSchema = new mongoose.Schema({
   method:{ type: String, default:'' },
   account:{ type: String, default:'' },
},
{ timestamps: true}
);

module.exports = mongoose.model('paymentMethod', paymentMethodSchema);