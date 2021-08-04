const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({

   userEmail:{
       type:String,
   },

   pass:{
    type:String,
   },

   userName:{
    type:String
   },

   logged:{
    type:String
   }
});

module.exports = Users = mongoose.model('Users', UsersSchema);