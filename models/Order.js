const
  conn = require('./conn'),
  LineItem = require('./LineItem.js'),
  Product = require('./Product.js')

const Order = conn.define('order', {
  isCart: {
    type: conn.Sequelize.BOOLEAN,
    defaultValue: true
  },
  address: {
    type: conn.Sequelize.STRING,
    defaultValue: null
  }
})

Order.updateFromRequestBody = function (OrderId, address) {
  Order.find({where: {id: OrderId}})
  .then(order => {
    order.address = address
    order.isCart = false
    return order.save()
  })
}

Order.addProductToCart = function (id) {
  let product
  Product.find({id})
  .then(_product => {
    product = _product
    return _product.getLineItem()
  })
  .then(lineItem => {
    if (lineItem) return lineItem.quantity++

    let _lineItem
    return LineItem.create()
    .then(lineItem => {
      Order.find({where: {isCart: true}})
      // product.setLineItem(lineItem)
    })
  })
}

Order.destroyLineItem = function (OrderId, LineId) {
  LineItem.find({id: LineId})
  .then(lineItem => lineItem.destroy())
}

module.exports = Order
