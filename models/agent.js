/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose

// User Model Definition
const agentSchema = new Schema({
  firstname: { type: String, required: true, unique: true, lowercase: true },
  lastname: { type: String, required: true, unique: true, lowercase: true },
  emailaddr: { type: String, required: true },
  mobilenumber: { type: String, required: true },
  address: { type: String, required: true },
  notifystatus: { type: String, required: true }
});

// Export Module/Schema
module.exports = mongoose.model('Agent', agentSchema);