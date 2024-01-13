const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./Models/User");
const port = 3000;

// Connect to MongoDB
connectDB();

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
