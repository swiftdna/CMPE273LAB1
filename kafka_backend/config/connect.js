const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'etsy';

async function main() {
  // Use connect method to connect to the server
  try {
    await client.connect();
    console.log('Connected successfully to mongo server');
    COREAPP.db = client.db(dbName);
  } catch (e) {
    console.log(e);
  }
}

module.exports = main;