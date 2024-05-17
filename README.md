# MicroservicesMiniProjet
Overview
This project is a demonstration of microservices architecture using REST, GraphQL, gRPC, and Kafka. The application consists of three main services: Product Service, Order Service, and an API Gateway. Each service is responsible for specific functionalities and communicates with other services using gRPC and Kafka. The API Gateway provides REST and GraphQL endpoints for client interactions.
Technologies Used
  •	REST: For simple HTTP API endpoints.
  •	GraphQL: For flexible and efficient data querying.
  •	gRPC: For high-performance RPC communication between services.
  •	Kafka: For message-driven communication and event streaming.
  •	Express.js: For building the REST API and GraphQL server.
  •	Apollo Server: For GraphQL implementation.
  •	Mongoose: For MongoDB object modeling.
  •	gRPC.js: For gRPC server and client implementation.


Running the Services
Start the Product Service:
  node productMicroservice.js
Start the Order Service
  node orderMicroservice.js
Start the API Gateway:
  node apiGateway.js

Setup MongoDB
Make sure you have MongoDB running locally or provide a MongoDB URI in the environment variables.

REST API Endpoints
Product Endpoints
Create Product
POST /products
Body: { "name": "Product Name", "description": "Product Description", "price": 100.0 }
Get All Products
    GET /products
Order Endpoints
Create Order
    POST /orders
Body: { "productIds": ["1", "2"] }
Get All Orders
  GET /orders
GraphQL API
Queries
Get Product by ID
    query {
  getProduct(id: "1") {
    id
    name
    description
    price
  }
}
Get All Products

  query {
  getProducts {
    id
    name
    description
    price
  }
}
Get Order by ID

  query {
  getOrder(id: "1") {
    id
    products {
      id
      name
    }
    totalPrice
    status
  }
}
Get All Orders
query {
  getOrders {
    id
    products {
      id
      name
    }
    totalPrice
    status
  }
}
Mutations
Create Product

graphql
Copier le code
mutation {
  createProduct(name: "Product Name", description: "Product Description", price: 100.0) {
    id
    name
    description
    price
  }
}
Create Order

graphql
Copier le code
mutation {
  createOrder(productIds: ["1", "2"]) {
    id
    products {
      id
      name
    }
    totalPrice
    status
  }
}
Kafka Integration
Product Service Kafka Consumer
The Product Service consumes messages from the product-topic topic.

Order Service Kafka Consumer
The Order Service consumes messages from the order-topic topic.

gRPC Services
Product Service gRPC
Create Product

proto
Copier le code
service ProductService {
  rpc CreateProduct (CreateProductRequest) returns (CreateProductResponse);
}

message CreateProductRequest {
  string name = 1;
  string description = 2;
  float price = 3;
}

message CreateProductResponse {
  Product product = 1;
}

message Product {
  string id = 1;
  string name = 2;
  string description = 3;
  float price = 4;
}
Order Service gRPC
Create Order

proto
Copier le code
service OrderService {
  rpc CreateOrder (CreateOrderRequest) returns (CreateOrderResponse);
}

message CreateOrderRequest {
  repeated string productIds = 1;
}

message CreateOrderResponse {
  Order order = 1;
}

message Order {
  string id = 1;
  repeated Product products = 2;
  float totalPrice = 3;
  string status = 4;
}

message Product {
  string id = 1;
  string name = 2;
  string description = 3;
  float price = 4;
}
Running Tests
To be implemented.


