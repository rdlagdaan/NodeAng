/* ===================
   Import Node Modules
=================== */
const express = require('express'); // Fast, unopinionated, minimalist web framework for node.
const app = express(); // Initiate Express Application
const router = express.Router(); // Creates a new router object.
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise;
const config = require('./config/database'); // Mongoose Config
const path = require('path'); // NodeJS Package for file paths
const user = require('./routes/user')(router); // Import Authentication Routes
const blogs = require('./routes/blogs')(router); // Import Blog Routes
const bodyParser = require('body-parser'); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const cors = require('cors'); // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
const multer = require('multer');
const agents = require('./routes/agents')(router);
const readcsv = require('./routes/readcsv')(router);

// Database Connection
mongoose.connect(config.uri, (err) => {
  if (err) {
    console.log('Could NOT connect to database: ', err);
  } else {
    console.log('Connected to database: ' + config.db);
  }
});

// Middleware
app.use(function(req, res, next) { //allow cross origin requests
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(express.static(__dirname + '/client/dist/')); // Provide static directory for frontend
app.use('/user', user); // Use Authentication routes in application
app.use('/blogs', blogs); // Use Blog routes in application
app.use('/agents', agents); // Use csv routes in application
app.use('/readcsv', readcsv); // Use csv routes in application

var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, './client/src/assets/uploads/');
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    //cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    cb(null, file.originalname);

  }
});


var upload = multer({ //multer settings
    storage: storage
}).single('file');

    /** API path that will upload the files */
app.post('/upload', function(req, res) {
  upload(req,res,function(err){
    //console.log(req.file.originalname);
    if(err){
      res.json({error_code:1,err_desc:err});
        return;
      }
      res.json({error_code:0,err_desc:null});
      console.log(req.file.destination);
      console.log(req.file.path);

    });
});
// Connect server to Angular 2 Index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

// Start Server: Listen on port 8080
app.listen(8080, () => {
  console.log('Listening on port 8080');
});