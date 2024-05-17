const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { Kafka } = require('kafkajs');

// Charger le fichier order.proto
const orderProtoPath = 'order.proto'; // Assurez-vous que le chemin est correct
const orderProtoDefinition = protoLoader.loadSync(orderProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const orderProto = grpc.loadPackageDefinition(orderProtoDefinition).order;

// Implémenter le service order
const orderService = {
  createOrder: (call, callback) => {
    const { productId, quantity } = call.request;
    // Effectuer la création de la commande dans la base de données ou autre traitement nécessaire
    const order = {
      id: '1', // Générer un ID approprié
      productId,
      quantity,
      // Ajouter d'autres champs de données pour la commande au besoin
    };
    callback(null, { order });
  },
  // Ajouter d'autres méthodes au besoin
};

// Créer et démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(orderProto.OrderService.service, orderService);
const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error('Échec de la liaison du serveur:', err);
      return;
    }
    console.log(`Le serveur s'exécute sur le port ${port}`);
    server.start();
  });
console.log(`Microservice de commandes en cours d'exécution sur le port ${port}`);

// Consumer Kafka pour écouter les messages du topic 'order-topic'
const kafka = new Kafka({
    clientId: 'order-service',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'order-group' });

const runConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'order-topic', fromBeginning: true });

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
