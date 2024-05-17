const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// In-memory data storage
let products = [];
let orders = [];

// Load GraphQL type definitions
const typeDefs = require('./schema');

// Load GraphQL resolvers
const resolvers = require('./resolvers');

// Load gRPC proto definitions
const productProtoPath = 'product.proto';
const orderProtoPath = 'order.proto';
const productProtoDefinition = protoLoader.loadSync(productProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const orderProtoDefinition = protoLoader.loadSync(orderProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const productProto = grpc.loadPackageDefinition(productProtoDefinition).product;
const orderProto = grpc.loadPackageDefinition(orderProtoDefinition).order;

// Create Express app
const app = express();
app.use(bodyParser.json());

// REST endpoint for creating products
app.post('/products', (req, res) => {
  try {
    const { name, description, price } = req.body;
    const newProduct = { id: `${products.length + 1}`, name, description, price };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REST endpoint for creating orders
app.post('/orders', (req, res) => {
  try {
    const { productIds } = req.body;
    const selectedProducts = productIds.map(id => products.find(product => product.id === id));
    const totalPrice = selectedProducts.reduce((acc, product) => acc + product.price, 0);
    const newOrder = { id: `${orders.length + 1}`, products: selectedProducts, totalPrice, status: 'Pending' };
    orders.push(newOrder);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GraphQL server setup
const apolloServer = new ApolloServer({ typeDefs, resolvers });

// Await server.start() before applying middleware
const startApolloServer = async () => {
  try {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
  } catch (err) {
    console.error('Error starting Apollo Server:', err);
  }
};

// gRPC clients setup
const productClient = new productProto.ProductService('localhost:50051', grpc.credentials.createInsecure());
const orderClient = new orderProto.OrderService('localhost:50052', grpc.credentials.createInsecure());

// REST endpoint for creating products using gRPC
app.post('/products/grpc', (req, res) => {
  const { name, description, price } = req.body;
  productClient.createProduct({ name, description, price }, (err, response) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json(response.product);
    }
  });
});

// REST endpoint for creating orders using gRPC
app.post('/orders/grpc', (req, res) => {
  const { productIds } = req.body;
  orderClient.createOrder({ productIds }, (err, response) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json(response.order);
    }
  });
});
// REST endpoint for getting all products
app.get('/products', (req, res) => {
  try {
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REST endpoint for getting all orders
app.get('/orders', (req, res) => {
  try {
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const port = 3000;
const startServer = async () => {
  try {
    await startApolloServer();
    app.listen(port, () => {
      console.log(`API Gateway running on port ${port}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
  }
};

startServer();
