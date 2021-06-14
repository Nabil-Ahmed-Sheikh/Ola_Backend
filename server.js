const express = require("express");
const morgan = require("morgan");
const http = require("http");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const chalk = require("chalk");
require('dotenv').config();
const mongoose = require("mongoose");
const app = express();  //Create new instance
const PORT = process.env.PORT || 5000; //Declare the port number
const path = require("path");
const { assignIdV4 } = require("./src/helper_functions/uniqueId");

// const redis = require("redis");
// const redisClient = redis.createClient(6379);

const auth = require("./src/routes/auth");
const common = require("./src/routes/common");
const admin = require("./src/routes/admin");


////////////////////////
///////  Server  ///////
////////////////////////
let server = http.createServer(app);
////////////////////////
/////  Server End  /////
////////////////////////


////////////////////////
//// Morgan Logger /////
////////////////////////
morgan.token("id", (req) => {
  return req.requestId;
})

let accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {flags:"a"} )

app.use(assignIdV4)
app.use(morgan(':id :method :status :url "HTTP/:http-version"'));     //enable incoming request logging
app.use(morgan(':id :method :status :url "HTTP/:http-version"',{stream: accessLogStream}));     //save incoming request logging
////////////////////////
// Morgan Logger End ///
////////////////////////





app.use(cors());
app.use(express.json());    //allows us to access request body as req.body





////////////////////////
/////// Routers ////////
////////////////////////
app.use("/auth/", auth);
app.use("/common/", common);
app.use("/admin", admin)

////////////////////////
///// Routers End //////
////////////////////////




app.get("", (req, res) => {   //Define the endpoint

  return res.send({
    status: "Healthy",
  });

});


////////////////////////
//////  Database  //////
////////////////////////
mongoose.connect(
  process.env.DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);
mongoose.connection.once("open", function () {
    console.log(chalk.green("Connection with database has been made"));
  }).on("error", function (error) {
    console.log("Connection error", error);
  });

////////////////////////
////  Database End  ////
////////////////////////





server.listen(PORT, () => {          // Start accepting requests
  console.log( chalk.green("Server started listening on port : ", PORT));
});