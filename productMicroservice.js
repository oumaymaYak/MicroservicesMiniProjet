const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { Kafka } = require('kafkajs');

// Charger le fichier product.proto
const productProtoPath = 'product.proto'; // Assurez-vous que le chemin est correct
const productProtoDefinition = protoLoader.loadSync(productProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const productProto = grpc.loadPackageDefinition(productProtoDefinition).product;

// Implémenter le service product
const productService = {
  createProduct: (call, callback) => {
    const { name, price } = call.request;
    
    const product = {
      id: '1', // Générer un ID approprié
      name,
      price,
    };
    callback(null, { product });
  },

};


const server = new grpc.Server();
server.addService(productProto.ProductService.service, productService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error('Échec de la liaison du serveur:', err);
      return;
    }
    console.log(`Le serveur s'exécute sur le port ${port}`);
    server.start();
  });
console.log(`Microservice de produits en cours d'exécution sur le port ${port}`);

// Consumer Kafka pour écouter les messages du topic 'product-topic'
const kafka = new Kafka({
    clientId: 'product-service',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'product-group' });

const runConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'product-topic', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log('received message');
            console.log({
                value: message.value.toString(),
                });
            
        },
    });
};

runConsumer().catch(console.error);
