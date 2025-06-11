const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },

    mobile: {
      type: String,
      unique: true,
   },

   isEmailVerified: { type: Boolean, default: false },
  
   
  role: {
    type: String,
    enum: ['user', 'admin','warden','mess_manager','care-tacker'],
    default: 'user'
  }
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;