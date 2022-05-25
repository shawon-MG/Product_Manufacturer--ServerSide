const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();

const cors = require('cors');

// MiddleWare :
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send("Final project's server is live");
});

app.listen(port, () => {
    console.log("Final project's sever side is listening on port");
});
