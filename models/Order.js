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
    AllowNull: false
  }
})

Order.updateFromRequestBody = function (OrderId, address) {
  return Order
  .find({where: {id: OrderId}})
  .then(order => {
    order.address = address
    order.isCart = false
    return order.save()
  })
}

Order.addProductToCart = function (productId) {
  return LineItem
    .find({
      where: {productId},
      include: [{ model: Order, where: {isCart: true} }]
    })
    .then(lineItem => {
      console.log(lineItem)
      if (lineItem) {
        return lineItem.update({quantity: conn.Sequelize.literal('quantity +1')})
      } else {
        return LineItem.create()
        .then(lineItem => {
          return Promise.all([
            Order.find({where: {isCart: true}}),
            Product.find({where: {id: productId}})
          ])
          .then(([order, product]) => {
            return Promise.all([
              lineItem.setOrder(order),
              lineItem.setProduct(product)
            ])
          })
        })
      }
    })
}

Order.destroyLineItem = function (OrderId, LineId) {
  return LineItem.find({id: LineId})
  .then(lineItem => lineItem.destroy())
}

module.exports = Order
