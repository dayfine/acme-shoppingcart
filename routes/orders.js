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
        order: [['id']],
        include: [{ model: LineItem,
          include: [{ model: Product }]
        }]
      }),
      products = Product.findAll({
        order: [['id']]
      })

    Promise.all([openOrder, closedOrders, products])
    .then(([openOrder, closedOrders, products]) => {
      res.locals.openOrder = openOrder
      res.locals.closedOrders = closedOrders
      res.locals.products = products
      next()
    })
    .catch(next)
  })

  .get('/', (req, res, next) => {
    res.render('index')
  })

  .put('/:id', (req, res, next) => {
    Order.updateFromRequestBody(req.params.id, req.body.address)
    .then(() => res.redirect('/'))
    .catch(ex => {
      if (ex.message === 'Validation error: Validation notEmpty on address failed') {
        return res.render('index', { error: ex })
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
