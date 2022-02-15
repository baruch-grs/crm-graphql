const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {

    });

    console.log('DB CONNECTED');
  } catch (error) {
    console.log(`An error has ocurred ${error}`);
    process.exit(1); // stops the app
  }
}

module.exports = connectDB;