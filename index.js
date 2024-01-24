require('dotenv').config();
const express = require('express')
const app = express();
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l9kydno.mongodb.net/?retryWrites=true&w=majority`;

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
    
    const userCollection = client.db("dreamState").collection("users")

    //Create user Endpoint
    app.post('/users', async(req, res) => {
        const user = req.body;
        const query = {email:user?.email}
        const existingUser = await userCollection.findOne(query)
        if(existingUser){
          return res.send({message:'User already exist', insertedId:null})
        }
        const result = await userCollection.insertOne(user)
        res.send(result)
      })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Job Task Server is here')
})

app.listen(port, () => {
    console.log(`Job Task is running on port ${port}`);
})
