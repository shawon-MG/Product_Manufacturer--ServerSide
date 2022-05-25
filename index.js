const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion } = require('mongodb');


require('dotenv').config();

const cors = require('cors');

// MiddleWare :
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster2.xd9lnfn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {

        await client.connect();
        const productCollection = client.db('final-project').collection('products');

        // Getting all Products: (Shown at home page) 
        app.get('/products', async (req, res) => {
            const products = await productCollection.find({}).toArray();

            res.send(products);
        });

    }
    finally {
        // no code for now...
    }

};
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send("Final project's server is live");
});

app.listen(port, () => {
    console.log("Final project's sever side is listening on port");
});
