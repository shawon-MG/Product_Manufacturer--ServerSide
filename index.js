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
        const profileDataCollection = client.db('final-project').collection('profiles');
        const userCollection = client.db('final-project').collection('users');

        // New User Creation : (for admin making)
        app.put('/users/:email', async (req, res) => {
            const { email } = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await userCollection.updateOne(filter, updateDoc, options);

            res.send(result);
        });

        app.get('/all-users', async (req, res) => {
            const allUsers = await userCollection.find().toArray();
            res.send(allUsers);
        });

        // Making a user Admin from all users: 
        app.put('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const updateDoc = {
                $set: { role: 'admin' }
            };
            const result = await userCollection.updateOne(filter, updateDoc);

            res.send(result);
        });

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
        // Deleting a purchased data : 
        app.delete('/purchase/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await purchaseDataCollection.deleteOne(filter);

            res.send(result);
        });

        app.get('/purchase/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const oneProductPayment = await purchaseDataCollection.findOne(query);
            res.send(oneProductPayment);
        });




        // Getting all review: ( shown at home page )
        app.get('/reviews', async (req, res) => {
            const reviewData = await reviewCollection.find({}).toArray();

            res.send(reviewData);
        });
        // Posting a review: ( shown at home page. From dashboard data is sended)
        app.post('/reviews', async (req, res) => {
            const purchaseData = req.body;
            const result = await reviewCollection.insertOne(purchaseData);

            res.send(result);
        });



        // Posting User's detail profile information to profileData collection in mongoDB
        app.post('/profile-info', async (req, res) => {
            const profileData = req.body;
            const result = await profileDataCollection.insertOne(profileData);

            res.send(result);
        });
        // Getting user profile information : ( Not shown at UI. But can be seen at localhoast of the server side)
        app.get('/profile-info', async (req, res) => {
            const result = await profileDataCollection.find({}).toArray();

            res.send(result);
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
