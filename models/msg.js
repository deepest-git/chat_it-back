const mongoose = require('mongoose');

const MsgSchema = new mongoose.Schema({

   frm:{
       type:String,
   },

   to:{
    type:String,
   },

   msg:{
    type:String
   },

   time:{
    type:String 
   },

   status:{
    type:String
   }

});

module.exports = Msg = mongoose.model('Msg', MsgSchema);