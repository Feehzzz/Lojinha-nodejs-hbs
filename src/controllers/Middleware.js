const jwt = require('jsonwebtoken');


module.exports = (req,res,next) => {
  const authHeader = req.headers.authorization;

  // verifica se existe o token no header
  if(!authHeader) 
  return res.status(401).send({error: 'Token não informado'});
  // separa o token em dois para verificar a existencia do bearer
  const parts = authHeader.split(' ');
  if(!parts.lenght === 2) 
  return res.status(401).send({error: 'Token error'});
  const [scheme, token] = parts;
  if(!/^Bearer$/i.test(scheme))
  return res.status(401).send({error: 'token malformated'});
  jwt.verify(token, process.env.secret, (err, decoded) => {
    if(err) 
    return res.status(401).send({error: 'token invalido'})
    req.userId = decoded.id;
    return next();
  });
};