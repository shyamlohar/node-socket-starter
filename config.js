var express = require('express');
var path = require('path');

module.exports = function (app, io){
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html');
	app.set('views', __dirname + '/views');
	app.use(express.static(path.join(__dirname + '/public')));

};