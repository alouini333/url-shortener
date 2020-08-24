const mongoose = require('mongoose');
require('dotenv').config();

const connectionURL = process.env.MONGO_URI;

const db = mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true  
});

module.exports = db;