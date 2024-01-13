const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://aman:5yhjbJJXFQm2Ik1c@cluster0.4ibjvcc.mongodb.net/",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "aman-portfolio",
      }
    );
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
