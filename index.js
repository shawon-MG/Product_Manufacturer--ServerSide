const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


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
        const reviewCollection = client.db('final-project').collection('reviews');
        const purchaseDataCollection = client.db('final-project').collection('purchaseProducts');

        // Getting all Products: (Shown at home page) 
        app.get('/products', async (req, res) => {
            const products = await productCollection.find({}).toArray();

            res.send(products);
        });
        // Getting a single product from all products: ( shown at purchase route/page. click on purchase btn at home page)
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const oneProduct = await productCollection.findOne(query);
            res.send(oneProduct);
        });



        // Posting user's purchased information to DB : ( Shown at purchaseData collection in mongoDB)
        app.post('/purchase', async (req, res) => {
            const purchaseData = req.body;
            const result = await purchaseDataCollection.insertOne(purchaseData);

            res.send(result);
        });
        // Getting all purchased information : ( Shown at payment route/page)
        app.get('/purchase', async (req, res) => {
            const purchaseData = await purchaseDataCollection.find({}).toArray();

            res.send(purchaseData);
        });




        // Getting all review: ( shown at home page )
        app.get('/reviews', async (req, res) => {
            const reviewData = await reviewCollection.find({}).toArray();

            res.send(reviewData);
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
