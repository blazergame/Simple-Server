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

//Initialize firebase
firebase.initializeApp({
    apiKey: config.db.apiKey,
    authDomain: config.db.authDomain,
    databaseURL: config.db.databaseURL,
    storageBucket: config.db.storageBucket
});

var db = firebase.database();

function initializeDB(){

    var connectedRef = db.ref(".info/connected");
    connectedRef.on("value", function(snap) {
      if (snap.val() === true) {
        console.log("Database is connected");
      } 
    });

}

//Initialize Database for connection
initializeDB();


/**************************************************************************************
Fetches the News API, run it through a summarizer and return summarized api data

    snapObj = {
        id: 1
        title: some title
        description some description
        url: www.someurl.com
        topics: [topicA,topicB,topicD]
        readTimeMinutes: 5
        image: www.someurl.com/image1
        summary: summary text body
    }
**************************************************************************************/
function getNewsApi(req, res) {

    axios.get(url)
        .then( (response) => {

            //Inserts all api data into it's own sub branch
            for(var i = 0; i < response.data.totalResults; i++){
                db.ref('/articles/' + i).set({
                    articles: response.data.articles[i]
                })
            }


            //Retrieving api data from db
            db.ref('/articles').once('value', (snap) => {
                snap.forEach((snapData) => {                   
                    
                    //Summarize url & insert into db
                    summerize(snapData.val().articles.url)
                        .then(summerizedData => {
                            db.ref('/summarizedArticles/' + snapData.key).set({
                                id : snapData.key,
                                title : summerizedData.title,
                                description : summerizedData.description,
                                url : summerizedData.canonicalLink,
                                topics : summerizedData.stats.topics,
                                readTimeMinutes : summerizedData.stats.minutes,
                                image : summerizedData.image,
                                summary : summerizedData.summary,
                            });
                        });
                });
            });

            //Send query of summarized api 
            db.ref('/summarizedArticles').on('value', (snap) => {
                res.send(snap.val());
            })
            
        })
        .catch(error => {
            console.log(error.response);
        });

}

module.exports = getNewsApi;