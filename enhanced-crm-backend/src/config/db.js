const mongoose = require('mongoose');
const { mongoURI } = require('./index');

const connectDB = async () => {
  try {
    console.log('Mongo URI:', mongoURI) 
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
};

module.exports = connectDB;