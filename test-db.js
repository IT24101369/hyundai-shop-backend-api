const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing connection to:', process.env.MONGO_URI.split('@')[1]); // Don't log password

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('SUCCESS: MongoDB Connected!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('FAILURE: MongoDB Connection Error:', err.message);
    process.exit(1);
  });
