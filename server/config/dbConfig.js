const mongoose = require('mongoose');
require('dotenv').config();


const URL= process.env.MONGO_URL;

const dbConnect= async () => {
  try {
    await mongoose.connect(URL)
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

module.exports = {dbConnect};