const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
  }

  type Order {
    id: ID!
    products: [Product!]!
    totalPrice: Float!
    status: String!
  }

  type Query {
    getProduct(id: ID!): Product
    getProducts: [Product!]!
    getOrder(id: ID!): Order
    getOrders: [Order!]!
  }

  type Mutation {
    createProduct(name: String!, description: String!, price: Float!): Product
    createOrder(productIds: [ID!]!): Order
  }
`;

module.exports = typeDefs;
