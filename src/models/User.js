const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogon: {
    type: Date, 
    default: Date.now,
  },
})

const User = mongoose.model('User', UserSchema);

module.exports = User;