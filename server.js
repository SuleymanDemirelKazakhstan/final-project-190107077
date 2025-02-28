const express = require('express');
const app = express();
const path = require('path');
var exphandle  = require('express-handlebars');
var handle = exphandle.create();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser());

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var ObjectId = require('mongodb').ObjectID;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret"}));

var {response} = require('express');

app.set('view engine', 'handlebars');
app.engine('handlebars', handle.engine);
app.use(express.static('public'));
app.use(express.static('files'));


MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	var dbo = db.db("Clothes");
	var cos = db.db("cosmetics");

	// app.use(express.static(path.join(__dirname,'/')));
	// app.use('/html',(req,res,next)=>{
	// res.sendFile(path.join(__dirname,'/','mainpage.html'));
	// });
	
	app.get('/clothes', (req, res) =>{
		dbo.collection("collection").find({}).toArray(function(err, results){
			if(err) throw err;
			res.render('clothes', {clothes: results, style: 'liststyle.css'});
		});
	});

	app.post('/filterbybrand', (req, res) => {
		var query = {brand: req.body.brand};
		dbo.collection("collection").find(query).toArray(function(err, results) {
			if(err) throw err;
			res.render('clothes', {clothes: results, style: 'liststyle.css'});
		});
	});

	app.post('/filterbytype', (req, res) => {
		var query = {type: req.body.type};
		console.log(query);
		dbo.collection("collection").find(query).toArray(function(err, results) {
			if(err) throw err;
			res.render('clothes', {clothes: results, style: 'liststyle.css'});
		});
	});

	app.post('/search', (req,res) =>{
		console.log(req.body.name)
		dbo.collection("collection").find({$text:{$search: req.body.name}}).toArray(function(err, results){
			if(err) throw err;
			res.render('search', {search: results, style: 'serchstyle.css'});
		});
	});

	app.use('/:id', (req, res) => {
		var query = req.params.id;
		console.log(query);
		dbo.collection("collection").find({_id:ObjectId(query)}).toArray(function(err, results) {
			if(err) throw err;
			res.render('element', {element: results, style: 'elementstyle.css'});
		});

	});

	var router = require('./router');
	app.use(router.router);

	app.listen(8090, function(){
		console.log("listening");
	});

	
});