const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { createProduct } = require("./controller/Product");
const productsRouters = require("./routes/Product");
const categoriesRouters = require("./routes/Category");
const brandsRouters = require("./routes/Brand");
const usersRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Order");
require("dotenv").config();
const path = require("path");

//
const session = require("express-session");
const passport = require("passport");
const { User } = require("./model/User");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");
const cookieParser = require("cookie-parser");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

//
const server = express();

//
server.use(express.static("build"));
//JWT options
var opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY;
//
//passport stratagies
server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    // store: new SQLiteStore({ db: "sessions.db", dir: "./var/db" }),
  })
);
server.use(cookieParser());
server.use(passport.authenticate("session"));

passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email: email }).exec();
      console.log(email, password, user);
      if (!user) {
        done(null, false, { message: "invalid credentials" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashPassword) {
          if (!crypto.timingSafeEqual(user.password, hashPassword)) {
            done(null, false, { message: "invalid credentials" });
          } else {
            const token = jwt.sign(sanitizeUser(user), SECRET_KEY); ///sign -> first argument is payload and second is secret key
            done(null, { id: user.id, role: user.role });
          }
        }
      );
    } catch (err) {
      done(err);
    }
  })
);
//jwt starategies
passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log("jwt payload", { jwt_payload });
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user));
      } else {
        return done(null, false);
      }
    } catch (err) {}
  })
);
//this create session variable req.user on being called from callback
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      role: user.role,
    });
  });
});
//this create session variable req.user when called authroized request
passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

// Middlewares
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use("/public", express.static(path.join(__dirname, "/public")));
server.use(express.static(path.join(__dirname, "/public")));

server.use(express.json()); // To parse req.body
server.use("/products", isAuth(), productsRouters.router);
server.use("/categories", isAuth(), categoriesRouters.router);
server.use("/brands", isAuth(), brandsRouters.router);
server.use("/users", isAuth(), usersRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", isAuth(), cartRouter.router);
server.use("/orders", isAuth(), orderRouter.router);
// server.use("/auth/login", authRouter.router);
const mongoURI = process.env.MONGODB_URI;

const connectToMongo = () => {
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("Connected to MongoDB Successful");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};

connectToMongo();

//payments
const stripe = require("stripe")(process.env.STRIPE_SECRET);

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;
  console.log(totalAmount, "totalAmount");

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 1000, //for decimal,
    currency: "inr",

    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

//payments end

server.get("/", (req, res) => {
  res.json({ status: "success" });
});
server.use("/products", createProduct);
//

//
server.listen(8080, () => {
  console.log("Server started on port 8080");
});
