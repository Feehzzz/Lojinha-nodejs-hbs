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
  // método de registro de usuario
  async register(req, res) {
    const { email } = req.body
    try {
      if (await User.findOne({ email })) {
        return res.status(400).send({ Error: "Email já registrado" })
      }
      const user = await User.create(req.body)
      // evitando que a senha e role do usuario retorn ao cadastrar/logar
      user.password = undefined;
      user.isAdmin = undefined;
      return res.send({
        user,
        token: gerateToken({ id: user.id })
      })

    } catch (err) {
      return res.status(400).send({ Error: 'Registration failed ' + err });
    }
  },
  // método de autenticação de usuario
  async auth(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).send({ Error: 'Usuário não encontrado' })
    }
    if (!await bcrypt.compare(password, user.password))
      return res.status(400).send({ Error: "Senha invalida" })
    user.password = undefined;
    user.isAdmin = undefined;
    user.lastLogon = new Date().getTime();
    // retorna o usuario logado com seu devido token, que é valido por 30 minutos
    return res.send({
      user,
      token: gerateToken({ id: user.id })
    });
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
        from: 'no-reply@gmail.com',
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