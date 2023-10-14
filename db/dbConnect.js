const mongoose = require("mongoose");
require("dotenv").config();

const DB_URL = process.env.DB_URL;

async function dbConnect() {
  mongoose
    .connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Success connect to MongoDB Atlas");
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB");
      console.log(error);
    });
}

module.exports = dbConnect;
