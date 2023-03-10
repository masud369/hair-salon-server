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
  const adminsCollection = client.db("hair-salon").collection("admins");
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  app.post('/postOrder', (req,res)=>{
    const orders = req.body;
    ordersCollection.insertOne(orders)
    .then(result=>{
        res.send(result.acknowledged);

    })
  })
  app.post('/makeAdmin', (req,res)=>{
    const admin = req.body;
    adminsCollection.insertOne(admin)
    .then(result=>{
        res.send(result.acknowledged);

    })
  }) 
  
  // app.get('/', (req,res)=>{
  //   const emailAdmin = req.query.email;
	// console.log(emailAdmin);
  //   adminsCollection.find(emailAdmin)
  //   .toArray((err,documents)=>{
  //       console.log(documents)
  //       res.send(documents.acknowledged);

  //   })
  // })
  
  app.post('/postReviews', (req,res)=>{
    const revew = req.body;
    reviewsCollection.insertOne(revew)
    .then(result=>{
        res.send(result.acknowledged);

    })
  })

  app.get('/getReviews', (req,res)=>{
    reviewsCollection.find()
    .toArray((err,documents)=>{
      res.send(documents);
  })
  })
  
  app.get('/orderList', (req,res)=>{
    ordersCollection.find({})
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
  
  app.get('/checkAdmins', (req,res)=>{
    const email = req.query.email;
  adminsCollection.find({email})
    .toArray((err,documents)=>{
      res.send(documents);
  })
  })

  app.put('/orderLists', (req, res) => {
    const updatedStutas = req.body.name;
    const updatedStutasId = req.body.id;
    console.log(updatedStutas,updatedStutasId);

    ordersCollection.findOneAndUpdate(
      { "_id" : updatedStutasId },
      { $inc: { "points" : 5 } }
   )

  })

  //   var myquery = { _id: updatedStutasId };
  // var newvalues = {$set: {stutas: updatedStutas} };
  // ordersCollection.updateOne(myquery, newvalues, function(err, res) {
  //   if (err) throw err;
  //   console.log("1 document updated");
  // });
  // })

  console.log("database connected properly!!");
});




app.listen(port )