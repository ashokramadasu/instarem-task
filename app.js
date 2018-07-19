'use strict'

// node modules set up ======================================================================
var express = require('express');
var app = express(); 						
var mongoose = require('mongoose'); 				
var port = process.env.PORT || 3000; 				
var dbConfig = require('./config'); 			
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// configuration ===============================================================
mongoose.connect(dbConfig.Db_url, { useNewUrlParser: true } ); 	// Connect to mlab remote MongoDB instance.

// Express Middleware settings
app.use(morgan('dev')); 
app.use(bodyParser.urlencoded({'extended': 'true'})); 
app.use(bodyParser.json()); 
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request


// routes ======================================================================
app.use('/', require('./routes'));

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
