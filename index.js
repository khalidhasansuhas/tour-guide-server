const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.d5moryc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('tourGuide').collection('services')
        const commentCollection = client.db('tourGuide').collection('comments')

        //services API
        //services for the services page
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray();
            res.send(services)
        })

        //services for home page limit to 3
        app.get('/servicesLimit', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query).sort({ $natural: -1 }).limit(3)
            const services = await cursor.toArray();
            res.send(services)
        })

        //service for a particular service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service)
        })

        //Comments api
        app.post('/comments', async (req, res) => {
            const comment = req.body;
            const result = await commentCollection.insertOne(comment);
            res.send(result)
        })

        // getting service specified comments
        app.get('/comments', async (req, res) => {
            let query = {};
            if (req.query.serviceId) {
                query = {
                    serviceId: req.query.serviceId
                }
            }
            const cursor = commentCollection.find(query);
            const comments = await cursor.toArray();
            res.send(comments)
        })


        // getting user specified comments
        app.get('/comments', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = commentCollection.find(query);
            const comments = await cursor.toArray();
            res.send(comments)
        })

        //deleting comments with specific id
        app.delete('/comments/:id', async (req, res) => {
            const {id} = req.params;
            const result = commentCollection.deleteOne({_id: ObjectId(id)})
            res.send(result)
        })
    }
    finally {

    }
} run().catch(e => console.log(e))

app.get('/', (req, res) => {
    res.send('tour guide server is running')
})

app.listen(port, () => {
    console.log(`tour guide server is running on port: ${port}`);
})