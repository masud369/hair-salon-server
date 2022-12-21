const express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
require('dotenv').config()
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.kz5wbn2.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`;


const port = 5000

app.use(cors())
app.use(bodyParser.json())


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const ordersCollection = client.db("hair-salon").collection("customers-orders");
  const reviewsCollection = client.db("hair-salon").collection("customers-reviews");
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  app.post('/postOrder', (req,res)=>{
    const orders = req.body;
    ordersCollection.insertOne(orders)
    .then(result=>{
        console.log(result)
        res.send(result.acknowledged);

    })
  })
  app.post('/postReviews', (req,res)=>{
    const revew = req.body;
    console.log(revew)
    reviewsCollection.insertOne(revew)
    .then(result=>{
        console.log(result)
        res.send(result.acknowledged);

    })
  })

  app.get('/getReviews', (req,res)=>{
    reviewsCollection.find()
    .toArray((err,documents)=>{
      res.send(documents);
  })
  })

  app.get('/getOrders', (req,res)=>{
    const email = req.query.email;
    ordersCollection.find({email})
    .toArray((err,documents)=>{
      res.send(documents);
  })
  })

  console.log("database connected properly!!");
});




app.listen(port )