'use strict';

var axios = require('axios');
const url = ''

function NewsAPI(cb) {

    axios.get(url)
        .then(response => {
            return 'aaa';
        }).catch(error => {
            console.log(error.response);
        });

}

module.exports = NewsAPI;