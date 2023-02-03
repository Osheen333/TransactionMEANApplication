const {MongoMemoryServer} = require("mongodb-memory-server");
const mongoose = require('mongoose');

exports.connect = async () => {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, { dbName: 'transactionDb'});
    console.log(`MongoDb successfully connected to ${mongoUri}`);
}