const express = require('express');
const path = require('path');

const api = express();

const PORT = 3000;


//middleware that will statically serve the folder public
api.use(express.static(path.join(__dirname, 'public')));

//we will serve this route with the index file
api.use('/', express.static('index.html'));

module.exports = api;