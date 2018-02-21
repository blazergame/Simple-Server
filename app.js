const express = require('express');
const app = express();
const config = require('./Config/config.json');
const port = process.env.PORT || config.server.port;

//List of APIs
var NewsAPI = require('./API/NewsAPI.js');


app.get('/', (req, res) => {
    res.send("Hello World!");
});


app.get('/v1/news', NewsAPI);




app.listen(port, () => {
    console.log("Current listening on port: " + port);
});