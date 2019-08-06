const Product = require('../models/Product');
const User = require('../models/User');


module.exports = {
  // traz todos os itens disponiveis do model de product
  async index(req, res) {
    const products = await Product.find()
    return res.json(products);
  },
  // metodo para criação de itens novos, caso seja adm
  async store(req, res) {
    const user = await User.findById(req.userId)
    if (user.role !== 1)
      return res.status(203).send({ forbidden: 'you don\'t have authorization to do that' })
    const product = await Product.find({ "title": req.body.title })
    if (product.length < 1) {
      const newItem = await Product.create(req.body)
      if (newItem.price < 1)
        return res.status(400).send({ erro: 'O valor não pode ser negativo' })
      if (newItem.quantity < 1)
        return res.status(400).send({ erro: 'A quantidade não pode ser negativa' })
      return res.json(newItem)
    } else {
      return res.status(400).send({ error: 'Produto já existente, tente atualizar utilizando id' })
    }
  },
  // atualização do produto existente através do id
  async update(req, res) {
    const user = await User.findById(req.userId)
    if (user.role !== 1)
      return res.status(203).send({ forbidden: 'you don\'t have authorization to do that' })
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    product.quantity += req.body.quantity

    return res.json(product)
  },
  // exclui o item do database
  async destroy(req, res) {
    const user = await User.findById(req.userId)
    if (user.role !== 1)
      return res.status(203).send({ forbidden: 'you don\'t have authorization to do that' })

    await Product.findByIdAndRemove(req.params.id)
    return res.status(200).send('Excluido com sucesso')
  }
}