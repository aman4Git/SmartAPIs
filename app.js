const express = require("express");
const app = express();
const connectDB = require("./config/database");
app.use(express.json());
const port = 3000;

//Routes actions for user
const usersRouter = require("./Routes/users");
app.use("/users", usersRouter);

// Connect to MongoDB
connectDB();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
