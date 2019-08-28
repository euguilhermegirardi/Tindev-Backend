const express = require("express"); // install.
const mongoose = require("mongoose"); // ODM, tool the allow us to use javacript syntax. Have to be after 'express'.
const cors = require("cors"); // send infos to the front-end.
const routes = require("./routes");
const app = express();
const server = require("http").Server(app); // extract the server 'http' from express.
const io = require("socket.io")(server); // To listen the websocket protocol.

// to receive the key (user's id) and the value of the key
// '18d943ujfd': 'id_from_socket'.
// Will receive this from 'frontend - Main.js'.
// Now I have to give this information to the 'Controller'. Best way is with 'middleware' ('app.use').
const connectedUsers = {};

// io.on (receive). Will receive the user's id from 'Main.js'
io.on('connection', socket => {
  const { user } = socket.handshake.query;

  connectedUsers[user] = socket.id;
});

// Connects to the Database.
mongoose.connect(
  // Link from cloud.mongodb.com (Connect -> Connect your application).
  "mongodb+srv://tinderdevapp:tinderdevapp@cluster0-kpgvt.mongodb.net/tinderdevapp8?retryWrites=true&w=majority",
  {
    // Just to inform moongose that this application will use a new format.
    useNewUrlParser: true
  }
);

// middleware gives to the Controller the information that is outside of it (match connection by the web socket).
app.use((req, res, next) => {
  // Just to NOT import 'io' again in the Controllers. That way I can use 'io' directaly by 'req'.
  req.io = io;
  // Giving the information about who is connected to the Controller.
  req.connectedUsers = connectedUsers;

  // 'next' runs the application.
  return next();
});

app.use(cors()); // Have to be before "routes".
app.use(express.json()); // Have to be before (routes). Just to inform Express that the application will use JSON in 'req'.
app.use(routes);

server.listen(3333);
