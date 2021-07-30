const mongoose = require('mongoose');
const config = require('../config/config.json');

(async() => {
    await mongoose.connect(config.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });      
})()