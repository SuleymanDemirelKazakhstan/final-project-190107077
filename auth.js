var express = require('express');
var router = express.Router();

var app = express();
var bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({
	extended: true
}));

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017/Users", {useNewUrlParser: true});

var userScheme = new Schema({
	number : {
		type: Number,
		required: true,
		min: 10
	}
});

var Users = mongoose.model('Users', userScheme);
MongoClient.connect(url, (err,db) =>{
	if(err) throw err;
	var data = db.db("Users");

	router.get('/auth', (req,res)=>{
		if(req.session.number){
			res.send("You already");
		}
		else{
			res.render('login.handlebars');
		}
	});

	router.post('/signed', (req,res)=>{
   	var number2 = req.body.number;
   	var query = {number: number2};
   data.collection('collection').find(query).toArray((err,result)=>{
   	if(result.length == 0){
   		var user = new ProjectUsers({
   			number: number2
   		});
   		req.session.number = number2;

   		user.save((err)=>{
   			if(err) throw err;
   		});
   		res.redirect('/mainpage.html');
   	}
   	else{
   		res.redirect('/mainpage.html');
   	}
   });
});
});


module.exports = router;