const exprees = require("express");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const jwt = require("jsonwebtoken");
const app = exprees();
const bodyParser = require("body-parser");

const secretKey = "secret";

// app.use(exprees.json());
// app.use(exprees.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");
const Book = require("./db/bookModel");
const Category = require("./db/categoryModel");
const BookDetail = require("./db/bookDetailModel");

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretKey,
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findOne({ _id: jwtPayload.sub });

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// can use more than one db
dbConnect("e-library");
// dbConnect("test");

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

// auth
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email, password: password })
    .then((user) => {
      if (user) {
        const payload = { sub: user.id, username: user.username };
        const token = jwt.sign(payload, secretKey);
        res.status(200).json({ token: token, user });
      } else {
        res.status(401).json({ message: "Authentication failed" });
      }
    })
    .catch((error) => {
      console.error("Error authentication", error);
      res.status(401).json({ error });
    });
});

// users
app.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.find()
      .then((users) => {
        console.log("users found: ", users);
        res.status(200).json({ users: users, message: "data user fetched" });
      })
      .catch((error) => {
        console.error("error finding user: ", error);
        res.status(200).json({ users: null, message: "users not exist" });
      });
  }
);

// book
app.get("/book", async (req, res) => {
  try {
    const books = await Book.find().populate("author_id", [
      "username",
      "first_name",
      "last_name",
    ]);
    res.status(200).json({
      books: books,
      message: "success get data book",
    });
  } catch (error) {
    res.status(400).json({ message: "books not exist", error });
  }
});

app.post(
  "/book",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = await User.findById(req.user._id);

    try {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const newBook = new Book({
        ...req.body,
        author_id: req.user._id,
      });
      await newBook.save();
      res.status(200).json({ message: "Book added success", data: newBook });
    } catch (error) {
      res.status(404).json({ message: "Book added failed", error });
    }
  }
);

app.patch(
  "/book/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = await User.findById(req.user._id);

    try {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const updateBook = await Book.findOneAndUpdate({
        ...req.body,
        author_id: req.user._id,
      });
      await updateBook.save();
      res
        .status(200)
        .json({ message: "Book update success", data: updateBook });
    } catch (error) {
      res.status(404).json({ message: "Book update failed", error });
    }
  }
);

app.delete(
  "/book/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = await User.findById(req.user._id);

    try {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await Book.deleteOne({
        _id: req.params.id,
      });
      res.status(200).json({ message: "Book delete success" });
    } catch (error) {
      res.status(404).json({ message: "Book delete failed", error });
    }
  }
);

// book detail
app.get(
  "/book-detail/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const book_detail = await BookDetail.findOne({ book_id: req.params.id });
      if (book_detail) {
        return res.status(200).json({
          message: "fetch detail book successfull",
          data: book_detail,
        });
      } else {
        return res.status(201).json({
          message: "book doesn't exist",
        });
      }
    } catch (error) {
      res.status(404).json({ message: "Failed to get book data", error });
    }
  }
);

app.post(
  "/book-detail",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { book_id, content } = req.body;
    try {
      const newBookDetail = new BookDetail({
        book_id,
        content,
      });
      newBookDetail
        .save()
        .then(() => {
          res.status(200).json({
            message: "Book detail added success",
            data: newBookDetail,
          });
        })
        .catch((error) => {
          res.status(404).json({ message: "Book detail added failed", error });
        });
    } catch (error) {}
  }
);

app.patch(
  "/book-detail/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { content } = req.body;
    try {
      const updateBookDetail = await BookDetail.findOneAndUpdate(
        { book_id: req.params.id },
        {
          content,
        }
      );
      await updateBookDetail.save();
      res.status(200).json({
        message: "Book detail update success",
      });
    } catch (error) {
      res.status(404).json({ message: "Book detail update failed", error });
    }
  }
);

app.delete(
  "/book-detail/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await BookDetail.deleteOne({ book_id: req.params.id });
      res.status(200).json({
        message: "Book detail delete success",
      });
    } catch (error) {
      res.status(404).json({ message: "Book detail delete failed", error });
    }
  }
);

// book categories
app.get("/categories", (req, res) => {
  Category.find()
    .then((categories) => {
      console.log("categories found: ", categories);
      res
        .status(200)
        .json({ categories: categories, message: "data categories fetched" });
    })
    .catch((error) => {
      console.error("error finding categories: ", error);
      res
        .status(200)
        .json({ categories: null, message: "categories not exist" });
    });
});

module.exports = app;
