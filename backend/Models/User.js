const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        trim:true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: [
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Please enter a valid email address"
        ],
        unique: true
    },
    password: {
        type: String,
        required: true,
    },

    mobile: {
      type: String,
      minlength: [10, "Mobile number must be 10 digits"],
      maxlength: [10, "Mobile number must be 10 digits"],
      match: [/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number"],
      unique: true,
   },

   isEmailVerified: { type: Boolean, default: false },
  
   
  role: {
    type: String,
    enum: ['user', 'admin','warden','mess_manager','care-tacker'],
    default: 'user'
  }
},{timestamps:true});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;