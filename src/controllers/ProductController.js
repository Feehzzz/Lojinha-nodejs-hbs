const Product = require('../models/Product');
const User = require('../models/User');
const csrf = require('csurf');




module.exports = {
  // método que verifica se o usuario é admin para efetuar alterações
  async isADM(req, res, next) {
    const { email } = req.body
    const user = await User.findOne(email)
    if (user.isAdmin === true) return next();
    return res.status(203).send({ forbidden: 'you don\'t have authorization to do that' })

  },
  // traz todos os itens disponiveis do model de product
  async index(req, res) {
    const products = await Product.find()
    let productArray = []
    let jump = 3;
    for (i = 0; i < products.length; i += jump) {
      productArray.push(products.slice(i, i + jump));
      
    }
    
    res.render('shop/index', { title: 'Home', product: productArray,  })
  },
  // metodo para criação de itens novos, caso seja adm
  async store(req, res) {
    const product = await Product.find({ "title": req.body.title })
    if (product.length < 1) {
      const { title, price, url_img, quantity } = req.body
      if (!title || !price || !url_img || !quantity) {
        req.flash('error_msg', 'Necessário preencher todos os campos')
        res.redirect('/products')
      }
      const newItem = new Product(req.body)

      if (newItem.price < 1) {
        req.flash('error_msg', 'O valor não pode ser negativo.')
        res.redirect('/products')
      }
      if (newItem.quantity < 1) {
        req.flash('error_msg', 'A quantidade não pode ser negativa')
        res.redirect('/products')
      }
      newItem.save(() =>{
        req.flash('success_msg', 'Produto adicionado com êxito.')
        res.redirect('/products')
      })
      
    } else {
      return res.status(400).send({ error: 'Produto já existente, tente atualizar utilizando id' })
    }
  },
  // atualização do produto existente através do id
  async update(req, res) {
    const { quantity, price } = req.body;

    try {
      const product = await Product.findById(req.params.id);
      if (quantity < 1)
        return res.status(400).send({ error: 'Quantidade não pode ser zero' })
      if (price < 1)
        return res.status(400).send({ error: 'O preço não pode ser zerado' })
      product.quantity += quantity;
      product.price = price
      await product.save()
      return res.json(product)
    } catch (err) {
      return res.status(404).send({ erro: 'Produto não encontrado' })
    }
  },
  // exclui o item do database
  async destroy(req, res) {
    await Product.findByIdAndRemove(req.params.id)
    return res.status(200).send('Excluido com sucesso')
  },
  renderProduct(req, res) {
    res.render('admin/products',{csrfToken: req.csrfToken()})
  }

}
