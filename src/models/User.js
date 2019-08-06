const mongoose = require('../database/server')
const bcrypt = require('bcryptjs')

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
// efetua um hash na senha do usuario antes de salvar no db
UserSchema.pre('save', async function(next){
  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
  next();
});
const User = mongoose.model('User', UserSchema);


module.exports = User;