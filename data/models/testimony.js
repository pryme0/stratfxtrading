const mongoose = require('mongoose');


//define the user schema
const testimonySchema = new mongoose.Schema({
    accountHolder:{ type: mongoose.Schema.Types.ObjectId,ref: 'User',},
    testimony:{ type: String, default:null },
   date:{ type: Date, default:Date.now() },
},
{ timestamps: true}
);




module.exports = mongoose.model('Testimony', testimonySchema);