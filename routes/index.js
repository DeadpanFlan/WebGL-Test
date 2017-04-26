var express = require('express');
var router = express.Router();
var f = require('fs');

var vert = f.readFileSync("public/shaders/index.vs")
var frag = f.readFileSync("public/shaders/index.fs")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', 
  	{ 
  		title: 'fdsafsdaf',
  		pagejs: 'javascripts/index_main.js',
  		vertex: vert,
  		fragment: frag

  	 });
});

module.exports = router;
