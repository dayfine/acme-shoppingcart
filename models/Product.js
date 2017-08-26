const
  conn = require('./conn')

const Product = conn.define('product', {
  name: {
    type: conn.Sequelize.STRING,
    allowNull: false,
    unique: true
  }
})

module.exports = Product
