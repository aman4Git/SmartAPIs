const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const URL = process.env.DATABASE_CONNECTION_STRING;
    await mongoose.connect(URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "smart-api",
      }
    );
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
