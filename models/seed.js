module.exports = (Product) => {
  return Promise.all([
    Product.create({ name: 'Diet Coke' }),
    Product.create({ name: 'Mountain Dew' }),
    Product.create({ name: 'Bubble Tea' })
  ])
  .then(products => { products })
}
