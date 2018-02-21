const express = require('express');
const app = express();
const config = require('./Config/config.json');
const port = process.env.PORT || config.server.port;

var axios = require('axios');
const NewsAPI = config.api.NewsAPI;

const country = 'us';
const category = 'technology';
const apiKey = config.api.NewsAPIKey;

const url = NewsAPI + 'country=' + country + '&' + 'category=' + category + '&' + 'apiKey=' + apiKey;

var summerize = require('summarizer').getPage;

var apiObjList = [];

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.get('/v1/news', (req, res) => {


    // summerize("https://www.gamespot.com/articles/fortnite-vs-pubg-which-battle-royale-game-is-right/1100-6456424/")
    //     .then(data => {
    //         //console.log(data);
    //     });

    //Need to summerize data to be short and consise to return back
    axios.get(url)
        .then(response => {
           //console.log(response.data.totalResults); 

           for(var i = 0; i < response.data.totalResults; i++){
               summarizeLink(response.data.articles[i].url, (data) => {
                    apiObjList.push(data);
                    //console.log(data);
               });

                if(i == 20){
                    console.log(i);
                    res.send(apiObjList);
                }
               
           }
        })
        .catch(error => {
            console.log(error.response);
        });

    
    
});

function summarizeLink(url, cb){

    summerize(url)
        .then(data => {

            var apiObj = {
                title : data.title,
                // description : data.description,
                // url : data.canonicalLink,
                // topics : data.stats.topics,
                // readTimeMinutes : data.stats.minutes,
                // image : data.image,
                // summary : data.summary
            }
            cb(apiObj);
        })
}

app.listen(port, () => {
    console.log("Current listening on port: " + port);
});