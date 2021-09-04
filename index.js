const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 8000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y0jnn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const imageCollections = client.db(`${process.env.DB_NAME}`).collection("images");
   

    app.post('/addImage', (req, res) => {
        const file = req.body;
        imageCollections.insertOne(file)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/images', (req, res) => {
        imageCollections.find({})
            .toArray((err, documents) => {
                res.send(documents);
                
            })
    })

    app.delete('/deleteImg/:id', (req, res) => {
        const id = req.params.id;
        console.log(id);
        imageCollections.deleteOne({ _id: ObjectId(id) }, (err, result) => {
            if (!err) {
                res.send({ count: 1 })
            }
        })
    })

    app.post('/imageByDates', (req, res) => {
        const date = req.body;
        
        imageCollections.find({ date: date.date })
            .toArray((err, documents) => {
                res.send(documents);
                console.log(documents)
            })
    })

});


app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})

app.listen(port)