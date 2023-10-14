const exprees = require("express");
const app = exprees();

const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");

dbConnect();

// add new user
// const newUser = new User({
//   email: "john@example.com",
//   password: "password123",
// });
// newUser
//   .save()
//   .then(() => {
//     console.log("User insert succesfully");
//   })
//   .catch((error) => {
//     console.error("insert data error: ", error);
//   });

// find user by email
// User.find({ email: "jean@example.com" })
//   .then((users) => {
//     console.log("users found: ", users);
//   })
//   .catch((error) => {
//     console.error("error finding user: ", error);
//   });

// get all user
// User.find()
//   .then((users) => {
//     console.log("users found: ", users);
//   })
//   .catch((error) => {
//     console.error("error finding user: ", error);
//   });

// update one user
// User.updateOne({ email: "john@example.com", password: "newpassword123" })
//   .then(() => {
//     console.log("update user success");
//   })
//   .catch((error) => {
//     console.error("update user failed: ", error);
//   });

// update many user
// User.updateMany(
//   { email: "jean@example.com" },
//   { $set: { password: "newpassword123" } }
// )
//   .then((result) => {
//     console.log("update user success: ", result);
//   })
//   .catch((error) => {
//     console.error("update user failed: ", error);
//   });

// delete one user
// User.deleteOne({ email: "jean@example.com" })
//   .then(() => {
//     console.log("delete success");
//   })
//   .catch((error) => {
//     console.error("delete user failed: ", error);
//   });

// delete many user
// User.deleteMany({ isActive: false })
//   .then((result) => {
//     console.log("delete users success: ", result);
//   })
//   .catch((error) => {
// console.error("delete users failed: ", error);
//   });

// covered queries
// User.collection.createIndex({ email: 5 });
// User.find({ email: "jean@example.com" })
//   .select({ email: 5, _id: 0 })
//   .then((result) => console.log("users found: ", result))
//   .catch((error) => {
//     console.error("error finding user: ", error);
//   });

app.get("/user", (req, res) => {
  User.find()
    .then((users) => {
      console.log("users found: ", users);
      res.status(200).json({ users: users, message: "data user fetched" });
    })
    .catch((error) => {
      console.error("error finding user: ", error);
      res.status(200).json({ users: null, message: "users not exist" });
    });
});

module.exports = app;
