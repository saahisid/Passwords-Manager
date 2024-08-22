const express = require('express')
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bodyparser = require('body-parser');
const cors = require('cors')

dotenv.config();

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'passop';
const app = express();
const PORT = 3001;
app.use(bodyparser.json())
app.use(cors());

async function startServer() {
  try {
    // Connect to the MongoDB server
    await client.connect();

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });

    // Define routes
    app.get('/', async (req, res) => {

   
      const db = client.db(dbName);
      const collection = db.collection('passwords');
      const findResult = await collection.find({ a: 3 }).toArray();
      res.json(findResult);
    });

    app.post('/', async (req, res) => {
        const password = req.body 
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const findResult = await collection.insertOne(password);
        res.send({success: true, result: findResult });
      });

      app.delete('/', async (req, res) => {
        const password = req.body 
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const findResult = await collection.deleteOne(password);
        res.send({success: true, result: findResult });
      });

  } catch (err) {
    console.error(err);
    process.exit(1); // Exit the process if an error occurs
  }
}

// Call the startServer function
startServer();
