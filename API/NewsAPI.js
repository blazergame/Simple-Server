'use strict';

var summerize = require('summarizer').getPage;
var axios = require('axios');
const config = require('../Config/config.json');

//DB
var firebase = require('firebase');

//API Related 
const NewsAPI = config.api.NewsAPI;
const country = 'us';
const category = 'technology';
const apiKey = config.api.NewsAPIKey;

const url = NewsAPI + 'country=' + country + '&' + 'category=' + category + '&' + 'apiKey=' + apiKey;

//Store api into db, query and summarize
firebase.initializeApp({
  
});


function getNewsApi(req, res) {

    axios.get(url)
        .then(response => {

          // console.log(response.data);
           //Push summerized data into global array
           for(var i = 0; i < response.data.totalResults; i++){
               summarizeLink(response.data.articles[i].url, (data) => {
                    //apiObjList.append(data);
                    console.log(data);
                    res.send(data);
               });
           }
            
        })
        .catch(error => {
            console.log(error.response);
        });

}


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

module.exports = getNewsApi;