const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express()

app.use(bodyParser.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jmmpi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = 5000


const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("InternProject").collection("userInformation");
  
  app.post('/fillUpData', (req, res) => {
      const userData = req.body;
      console.log(userData);
      collection.insertOne(userData)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })

  app.get('/allUser', (req, res) =>{
      collection.find({})
      .toArray( (err, documents) => {
        res.send(documents);
      })
  })


  app.delete('/delete/:id', (req, res) =>{
    console.log(req.params.id);
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {      
      res.redirect('/')
    })
  })
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)
