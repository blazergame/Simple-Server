const express = require('express');
const app = express();
const config = process.env.PORT || require('./Config/config.json');

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.listen(config.server.port, () => {
    console.log("Current listening on port: " + config.server.port);
})