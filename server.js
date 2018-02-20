const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const savorController = require("./controllers/savorController");
const app = express();
const PORT = process.env.PORT || 3001;
require('dotenv').config();

// Configure body parser for axios requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Serve up static assets
app.use(express.static("client/build"));
// Add routes, both API and view
app.use(savorController);

// Set up promises with mongoose
mongoose.Promise = global.Promise;
// Connect to the Mongo DB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/savordb2",
  {
    // useMongoClient: true
  }
);

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
