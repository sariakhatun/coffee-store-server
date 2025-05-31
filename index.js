const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, Collection, ObjectId } = require('mongodb');
require('dotenv').config()

let app = express();
let port = process.env.PORT || 3000


app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.50gybqn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    let coffeesCollection = client.db('coffeeDB').collection('coffees')


    app.get('/coffees',async(req,res)=>{
        let cursor = coffeesCollection.find();
        let result = await cursor.toArray();
        res.send(result);
    })
    
    app.get('/coffees/:id',async(req,res)=>{
        let id = req.params.id;
        let query = {_id: new ObjectId(id)}
        let result = await coffeesCollection.findOne(query)
        res.send(result)
    })

    app.post('/coffees',async(req,res)=>{
        let newCoffee = req.body
        console.log(newCoffee)
        let result = await coffeesCollection.insertOne(newCoffee)
        res.send(result)
        
    })

    app.put('/coffees/:id',async(req,res)=>{
        let id = req.params.id
        let query = {_id: new ObjectId(id)}
        let updatedCoffee = req.body
        let updatedDoc = {
            $set : updatedCoffee
        }
        let result = await coffeesCollection.updateOne(query,updatedDoc)
        res.send(result);

    })

    app.delete('/coffees/:id',async(req,res)=>{
            let id = req.params.id
            let query = {_id : new ObjectId(id)}
            let result = await coffeesCollection.deleteOne(query)
            res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Coffee server is getting hotter.')
})

app.listen(port,()=>{
    console.log(`Coffee server is running on port ${port}`)
})