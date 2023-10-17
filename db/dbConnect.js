const mongoose = require("mongoose");
require("dotenv").config();

const DB_URL = process.env.DB_URL;

// dbName props is use to define what database to use in a single cluster
async function dbConnect(dbName) {
  mongoose
    .connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName,
    })
    .then(() => {
      console.log("Success connect to MongoDB Atlas:", dbName);
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB");
      console.log(error);
    });
}

module.exports = dbConnect;
