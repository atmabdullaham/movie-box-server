const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const e = require('express');




// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4lxln.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
 serverApi: {
  version: ServerApiVersion.v1,
  strict: true,
  deprecationErrors: true,
 }
});

async function run() {
 try {
  // Connect the client to the server	(optional starting in v4.7)
  await client.connect();
  const database = client.db("movieDB");
  const movieCollection = database.collection("movies");
  const favoriteCollection = database.collection("favorite");


  app.get("/movie", async (req, res) => {
   const cursor = movieCollection.find();
   const result = await cursor.toArray()
   res.send(result)
  })

  app.get("/favorite/:email", async (req, res) => {
   const email = req.params.email
   const query = { email: email };
   const cursor = favoriteCollection.find(query);
   const result = await cursor.toArray()
   res.send(result)
  })


  app.get("/movie/:id", async (req, res) => {
   const id = req.params.id
   const query = { _id: new ObjectId(id) };
   const result = await movieCollection.findOne(query);
   res.send(result)
  })

  app.post("/movie", async (req, res) => {
   const newMovie = req.body
   console.log(newMovie)
   const result = await movieCollection.insertOne(newMovie);
   res.send(result)

  })
  app.post("/favorite", async (req, res) => {
   const favoriteMovie = req.body
   console.log(favoriteMovie)
   const result = await favoriteCollection.insertOne(favoriteMovie);
   res.send(result)

  })

  app.delete("/movie/:id", async (req, res) => {
   const id = req.params.id
   console.log(id)
   const query = { _id: new ObjectId(id) };
   const result = await movieCollection.deleteOne(query);
   res.send(result)
  })

  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
 } finally {
  // Ensures that the client will close when you finish/error
  // await client.close();
 }
}
run().catch(console.error);


app.get("/", (req, res) => {
 res.send("Server is running...")
})

app.listen(port, () => {
 console.log(`server is running  on port: ${port}`)
})