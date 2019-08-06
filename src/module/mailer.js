const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars');

const transport = nodemailer.createTransport({
  host: process.env.nodem_host,
  port: process.env.nodem_port,
  auth: {
    user: process.env.nodem_user,
    pass: process.env.nodem_pass
  }
});
transport.use('compile' ,hbs({
  viewEngine:'handlebars',
  viewPath: path.resolve('./src/module/mail'),
  extName: '.html',
}));
module.exports = transport;