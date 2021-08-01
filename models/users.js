const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({

   userEmail:{
       type:String,
       required:true
   },

   pass:{
    type:String,
    required:true
   },

   userName:{
    type:String
   },

   logged:{
    type:String
   }
});

module.exports = Users = mongoose.model('Users', UsersSchema);