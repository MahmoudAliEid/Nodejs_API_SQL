const express = require("express");
const bodyParser = require("body-parser");
const passportConfig = require("./lib/passportConfig");
const app = express();
const cors = require("cors");

const PORT = 5050;
//to recive data
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Setting up middlewares
app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize());
// Routing
app.use("/auth", require("./router/authRouter"));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});

app.get("/", (req, res) => {
  res.status(200).send("The Sever run successfully By Ammar!");
});
