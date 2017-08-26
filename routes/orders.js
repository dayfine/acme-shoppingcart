const
  { Order, LineItem, Product } = require('../models').models,
  router = require('express').Router(),
  bodyParser = require('body-parser')

router
  .use(bodyParser.urlencoded({extended: false}))

  .use('/', (req, res, next) => {
    let
      openOrder = Order.find({
        where: {isCart: true},
        include: [{ model: LineItem,
          include: [{ model: Product }]
        }]
      })
      .then(result => {
        return result || Order.create()
      }),
      closedOrders = Order.findAll({
        where: {isCart: false},
        include: [{ model: LineItem,
          include: [{ model: Product }]
        }]
      })

    Promise.all([openOrder, closedOrders])
    .then(([openOrder, closedOrders]) => {
      req.openOrder = openOrder
      req.closedOrders = closedOrders
      next()
    })
    .catch(next)
  })

  .get('/', (req, res, next) => {
    const openOrder = req.openOrder, closedOrders = req.closedOrders
    // console.log('open', openOrder)
    // console.log('closed', closedOrders)
    Product.findAll({order: [['id']]})
    .then((products) => res.render('index', {products, openOrder, closedOrders}))
    .catch(next)
  })

  .put('/:id', (req, res, next) => {
    console.log('body', req.body)
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
