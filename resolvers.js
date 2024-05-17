let products = [];
let orders = [];

const resolvers = {
  Query: {
    getProduct: (_, { id }) => products.find(product => product.id === id),
    getProducts: () => products,
    getOrder: (_, { id }) => orders.find(order => order.id === id),
    getOrders: () => orders,
  },
  Mutation: {
    createProduct: (_, { name, description, price }) => {
      const newProduct = { id: `${products.length + 1}`, name, description, price };
      products.push(newProduct);
      return newProduct;
    },
    createOrder: (_, { productIds }) => {
      const selectedProducts = productIds.map(id => products.find(product => product.id === id));
      const totalPrice = selectedProducts.reduce((acc, product) => acc + product.price, 0);
      const newOrder = { id: `${orders.length + 1}`, products: selectedProducts, totalPrice, status: 'Pending' };
      orders.push(newOrder);
      return newOrder;
    }
  }
};

module.exports = resolvers;
