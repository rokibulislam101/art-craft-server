const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mufx5zx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const craftCollection = client.db('craftART').collection('craft');

    app.get('/craft', async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //ID Targeting
    app.get('/craft/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.findOne(query);
      res.send(result);
    });

    // Email Targeting
    app.get('/craft-data/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await craftCollection.find(query).toArray();
      res.send(result);
    });

    app.post('/craft', async (req, res) => {
      const newCraft = req.body;
      console.log(newCraft)
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    })

    app.put('/craft/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updatedCraft = req.body;

      const craft = {
        $set: {
          name: updatedCraft.name,
          subcategory: updatedCraft.subcategory,
          customization: updatedCraft.customization,
          price: updatedCraft.price,
          rating: updatedCraft.rating,
          time: updatedCraft.time,
          image: updatedCraft.image,
          status: updatedCraft.status,
          description: updatedCraft.description,
        }
      };

      const result = await craftCollection.updateOne(filter, craft, options);
        res.send(result);
    })

    app.delete('/craft/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a Successful Connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Art & Craft Server is running');
})

app.listen(port, () => {
  console.log(`Art & Craft Server is running or port: ${port}`);
})