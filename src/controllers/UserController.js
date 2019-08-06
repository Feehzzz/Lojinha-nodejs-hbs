const User = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth')

function gerateToken(params = {}){
  return jwt.sign( params, authConfig.secret, {
    expiresIn: 1800000,
  });
}

module.exports = {
  async register(req,res){
    const {email} = req.body
    try {
      if(await User.findOne({email})) {
        return res.status(400).send({Error: "Email já registrado"})
      }
      const user = await User.create(req.body)
      user.password = undefined;
      user.role = undefined;
      return res.send({ 
        user,
        token: gerateToken({id: user.id}) 
      })

    } catch (err) {
      return res.status(400).send({Error: 'Registration failed '+ err});
    }
  },
  async auth(req,res){
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if(!user){
      return res.status(404).send({Error: 'Usuário não encontrado'})
    }
    if(!await bcrypt.compare(password, user.password))
      return res.status(400).send({Error: "Password invalido"})
    user.password = undefined;
    user.role = undefined;
    user.lastLogon = new Date().getTime()
    
    
   
    
    return res.send({
      user, 
      token: gerateToken({ id: user.id})
    });
  },
}