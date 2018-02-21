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
      } else {
        console.log("Database is not connected");
      }
    });

}


//TODO: 
//Test querying db
//Insert news api into db
//Query, summarize and return to res
function getNewsApi(req, res) {

    //Check if db is connected
    //initializeDB();
  
    //Insert into db route /usrs/1 -> {email: 'test@gmail.com, username: 'benson'}
    db.ref('/usrs/' +  3).set({
        username: 'bensonaaa',
        email: 'test@gmail.com'
    });

    db.ref('/usrs/3').once('value').then((snap) => {
        console.log(snap.val());
    })  

    axios.get(url)
        .then(response => {

          // console.log(response.data);
           //Push summerized data into global array
           for(var i = 0; i < response.data.totalResults; i++){
               summarizeLink(response.data.articles[i].url, (data) => {
                    //apiObjList.append(data);
                    //console.log(data);
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