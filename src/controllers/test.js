module.exports = {
  check(req,res){
    return res.send({ ok: true, user: req.user})

  }
}