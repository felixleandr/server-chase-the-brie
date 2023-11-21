const { MongoClient } = require("mongodb");
require("dotenv").config();

const env = process.env.NODE_ENV || 'development';

let uri = process.env.MONGO_CONNECTION
let dbName = "ChaseTheBrie"

if(env === 'test') {
  uri = process.env.MONGO_TESTING_URI
  dbName = "ChaseTheBrie_test"
} 
const client = new MongoClient(uri);

let db;
async function connect() {
  try {
    await client.connect();
    db = client.db(dbName);
  } catch (err) {
    console.log(err);
  }
}

function getDb() {
  return db;
}

module.exports = { connect, getDb };
