const Product = require('../models/Product');
const User = require('../models/User');

  // função que verifica se o usuário é adm
async function isADM(id){
  const user = await User.findById(id)
    if (user.role !== 1)
      return res.status(203).send({ forbidden: 'you don\'t have authorization to do that' })
}

module.exports = {
  // traz todos os itens disponiveis do model de product
  async index(req, res) {
    const products = await Product.find()
    return res.json(products);
  },
  // metodo para criação de itens novos, caso seja adm
  async store(req, res) {
    isADM(req.userId)
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
    isADM(req.userId);
    const {quantity, price } = req.body;

    try {
    const product = await Product.findById(req.params.id);
      if(quantity < 1)
      return res.status(400).send({error: 'Quantidade não pode ser zero'})
      if(price < 1)
      return res.status(400).send({error: 'O preço não pode ser zerado'})
      await product.update({
        quantity: product.quantity += quantity,
        price: product.price = price
      })
      return res.json(product)
    } catch (err) {
      return res.status(404).send({erro: 'Produto não encontrado'})
    }  
  },
  // exclui o item do database
  async destroy(req, res) {
    isADM(req.userId);

    await Product.findByIdAndRemove(req.params.id)
    return res.status(200).send('Excluido com sucesso')
  }
}