const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.d5moryc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
try{
 const serviceCollection = client.db('tourGuide').collection('services')

 app.get('/services', async(req,res)=>{
    const query = {}
    const cursor = serviceCollection.find(query)
    const services = await cursor.toArray();
    res.send(services)
 })
}
finally{

}
}run().catch(e=>console.log(e))

app.get('/', (req, res) => {
    res.send('tour guide server is running')
})

app.listen(port, () => {
    console.log(`tour guide server is running on port: ${port}`);
})