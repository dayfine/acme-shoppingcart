const
  { Order, Product } = require('../models').models,
  router = require('express').Router(),
  bodyParser = require('body-parser')

let currentOrder

router
  .use(bodyParser.urlencoded({extended: false}))

  .use('/', (req, res, next) => {
    Order.find({where: {isCart: true}})
    .then(order => {
      currentOrder = order
      next()
    })
    .catch(next)
  })

  .get('/', (req, res, next) => {
    console.log(currentOrder)
    Product.findAll({order: [['id']]})
    .then((products) => res.render('index', {products, currentOrder}))
    .catch(next)
  })

  .put('/:id', (req, res, next) => {
    Order.updateFromRequestBody(req.params.id, req.body.address)
    .then(() => res.redirect('/'))
    .catch(ex => {
      if (ex.message === 'address required') {
        return res.render('error', { error: ex })
      }
      next(ex)
    })
  })

  .post('/:id/lineItems', (req, res, next) => {
    console.log('body', req.body)
    Order.addProductToCart(req.body.productId * 1)
    .then(() => res.redirect('/'))
    .catch(next)
  })

  .delete('/:orderId/lineItems/:id', (req, res, next) => {
    Order.destroyLineItem(req.params.orderId, req.params.id)
    .then(() => res.redirect('/'))
    .catch(next)
  })

module.exports = router
