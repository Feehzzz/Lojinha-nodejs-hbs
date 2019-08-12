const User = require('../src/models/User');
const bcrypt = require('bcryptjs')
const localStrategy = require('passport-local').Strategy;


module.exports = function (passport) {
  passport.use(
    new localStrategy({ usernameField: 'email' }, (email, password, done) => {

      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'E-mail não encontrado' });
        }
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Senha invalida' });
          }
        });
      }).catch(err => {
        throw err
      })
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};