const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const { urlencoded } = require('express');
require('dotenv').config();
const port = process.env.PORT||5000;
const app = express();
//midelware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zr4ws.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(process.env.DB_USER,process.env.DB_PASS);
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
 try {
    await client.connect();
    const serviceCollection = client.db('wedding').collection('service');
    
    app.get('/service',async(req,res) =>{
        const query = {};
        const cursor = serviceCollection.find(query)
        const services = await cursor.toArray();
        res.send(services);
        
    });
    app.get('/service/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const service = await serviceCollection.findOne(query)
        res.send(service);
    })
    //Post
    app.post('/service',async(req,res)=>{
        const newservice = req.body;
        const result = await serviceCollection.insertOne(newservice);
        res.send(result);
    })
    //delete
    app.delete('/service/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await serviceCollection.deleteOne(query)
        res.send(result);
    })
 }
 finally{
 }  
}
run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send('running wedning house')
});
app.listen(port,()=>{
    console.log("listening to port ",port)
});