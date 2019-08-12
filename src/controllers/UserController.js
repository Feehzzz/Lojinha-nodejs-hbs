
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const transport = require('../module/mailer');






function gerateToken(params = {}) {
  return jwt.sign(params, process.env.secret, {
    expiresIn: 1800000,
  });
}

module.exports = {
  isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Por favor, efetue o login para acessar o recurso');
    res.redirect('/login');
  },
  notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/profile');      
  },
  // método de registro de usuario
  async register(req, res) {
    const { email, name, password, password2 } = req.body
    let erros = []
    
      if (await User.findOne({ email })) {
        erros.push("Email já registrado");
      }
      if(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi.test(email) === false) erros.push('Email em formato invalido')
      
      if(password.length < 6 ){
        erros.push('Senha deve conter mais do que 6 caracteres')
      }
      if(password !== password2){
        erros.push('Senhas não batem')
      }
      if(!email || !name || !password || !password2){
        erros.push('Preencha todos os campos')
      }
      if(erros.length > 0){
        res.render('user/register', {
          erros 
            
        })
      } else {
        const user = User.create(req.body).then(() => {
          
          req.flash('success_msg','Conta criada com sucesso!')
          res.redirect('/login')
        }).catch(err => console.log(err))
      }
    
  },
  registerGET(req,res){
    res.render('user/register',{
    title: 'Register'})
  },
  authGET(req,res) {
    res.render('user/login', {
      title: "Login"
    })
  },
  forgotGet(req,res) {
    res.render('user/forgot')
  },
  async recovery(req, res) {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      const { name } = user;
      if (!user)
        return res.status(404).send({ Error: 'Usuário não encontrado' })
      const token = crypto.randomBytes(20).toString('hex');
      const now = new Date();
      now.setHours(now.getHours() + 1);
      await User.findByIdAndUpdate(user.id, {
        '$set': {
          passResetToken: token,
          passResetExpire: now,
        }
      });
      transport.sendMail({
        to: email,
        from: 'noreply@test.com',
        template: 'forgot_password',
        context: { token, name},
      }, (err) => {
        if (err)
        return res.status(400).send({ error: 'não foi possível enviar o email' });

        return res.send('Email enviado com sucesso')
      })
    } catch (err) {
      
      return res.status(400).send({ error: "erro ao recuperar senha" })
    }
  },
  async reset(req,res){
    const { email, token, password  } = req.body;
    const now = new Date();
    try {
      const user = await User.findOne({ email }).select('+passResetToken passResetExpire');
      if(token !== user.passResetToken)
      return res.status(400).send({error: 'Token invalido'});
      
      if(now > user.passResetExpire)
      return res.status(400).send({error: 'Token expirado, gere um novo'});

      user.password = password;
      
      await user.save();
      return res.send({Sucesso: "Senha alterada com êxito"})
    } catch (err) {
      return res.status(400).send({ error: "Não foi possível resetar a senha, tente novamente" });
      
    }
  },
  
  
}