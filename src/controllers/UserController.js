
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const transport = require('../module/mailer');
const csrf = require('csurf');







function gerateToken(params = {}) {
  return jwt.sign(params, process.env.secret, {
    expiresIn: 1800000,
  });
}

module.exports = {
  LoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Por favor, efetue o login para acessar o recurso.');
    res.redirect('/login');
  },
  notLogged(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/profile');      
  },
  isAdmin (req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
      return next();
    }
    req.flash('error_msg', 'Você não tem autorização para acessar esse recurso.');
    res.redirect('/');
  },
  // método de registro de usuario
  async register(req, res) {
    const { email, name, password, password2 } = req.body
    let erros = []
    
      if (await User.findOne({ email })) {
        erros.push("Email já registrado");
      }
      if(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi.test(email) === false) erros.push('Email em formato invalido.')
      
      if(password.length < 6 ){
        erros.push('Senha deve conter mais do que 6 caracteres.')
      }
      if(password !== password2){
        erros.push('Senhas não batem.')
      }
      if(!email || !name || !password || !password2){
        erros.push('Preencha todos os campos.')
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
    title: 'Register', csrfToken: req.csrfToken()})
  },
  authGET(req,res) {
    res.render('user/login', {
      title: "Login", csrfToken: req.csrfToken()
    })
  },
  forgotGet(req,res) {
    res.render('user/forgot',{csrfToken: req.csrfToken()})
  },
  Logout(req, res){
    req.logout();
    res.redirect('/');
  },
  async recovery(req, res) {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      const {name} = user;
      
      if (!user){
        req.flash('error_msg','Email não encontrado')
        res.redirect('/forgot')
      }
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
        from: 'noreplysystem380@gmail.com',
        subject: 'Recovery password',
        template: 'forgot_password',
        context: { token, name},
      }, (err) => {
        if (err){
        req.flash('error_msg','Não foi possível enviar o email')
        res.redirect('/forgot');
        }

        req.flash('success_msg','Email enviado com sucesso!')
        res.redirect('/reset')
      })
    } catch (err) {
      req.flash('error_msg','Erro ao enviar email')
      res.redirect('/forgot')
    }
  },
  resetGet(req,res){
    res.render('user/reset', {csrfToken: req.csrfToken()})
  },
  async reset(req,res){
    const { email, token, password, password2  } = req.body;
    const now = new Date();
    try {
      
      const user = await User.findOne({ email })
     
      if(token !== user.passResetToken){
        req.flash('error_msg','Token invalido');
        res.redirect('/reset');
      }
      if(now > user.passResetExpire){
        req.flash('error_msg','Token expirado, gere um novo');
        res.redirect('/reset');
      }
      if(password.length < 6){
        req.flash('error_msg','Senha precisa ter pelo menos 6 caracteres');
        res.redirect('/reset');
      }
      if(password !== password2){
        req.flash('error_msg','Senhas não batem, tente novamente');
        res.redirect('/reset');
      }
      user.password = password;
      user.passResetToken = null;
      await user.save();
      req.flash('success_msg','Senha alterada com êxito');

      res.redirect('/login');
    } catch (err) {
      
      return res.status(400).send({ error: "Não foi possível resetar a senha, tente novamente" });
      
    }
  }, 
  async update(req, res) {
    const {  wallet } = req.body;

    try {
      const user = await User.findById(req.params.id);
      
      user.wallet += wallet;
      
      await user.save()
      return res.json(user)
    } catch (err) {
      return res.status(404).send({ erro: 'User not found' })
    }
  },
}