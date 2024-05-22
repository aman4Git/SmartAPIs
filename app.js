const express = require("express");
const app = express();
const connectDB = require("./Config/database");
app.use(express.json());
const port = 3000;
const http = require("http");
const server = http.createServer(app);
const path = require("path");

//Socket.io server
const {Server} = require("socket.io");

//Create server instance
const io = new Server(server);

//Handle socket.io
io.on("connection", (socket) =>{
  socket.on("user-message", (message) => {
    io.emit("message", message);
  });
});

//Render HTML file
app.use(express.static(path.resolve("./public")));

//Routes actions for Socket.io
app.get("/", (req, res) => {
  res.sendFile("/public/index.html");
})

//Routes actions for user
const usersRouter = require("./Routes/users");
app.use("/users", usersRouter);

// Connect to MongoDB
connectDB();

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
