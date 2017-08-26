const
  conn = require('./conn'),
  Order = require('./Order'),
  LineItem = require('./LineItem'),
  Product = require('./Product')

LineItem.belongsTo(Product)
LineItem.belongsTo(Order)
Order.hasMany(LineItem)

const sync = () => conn.sync({ force: true })

const seed = () => {
  return require('./seed')(Product)
}

module.exports = {
  sync,
  seed,
  models: {
    Order,
    LineItem,
    Product
  }
}
