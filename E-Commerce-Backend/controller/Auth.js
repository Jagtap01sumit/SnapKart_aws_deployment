const { User } = require("../model/User");
const crypto = require("crypto");
const { sanitizeUser } = require("../services/common");
const SECRET_KEY = "SECRET_KEY";
const jwt = require("jsonwebtoken");
exports.createUser = async (req, res) => {
  // const user = new User(req.body);

  // if (!req.body.email) {
  //   return res.status(400).json({ error: "Email is required" });
  // }
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashPassword) {
        const user = new User({ ...req.body, password: hashPassword, salt });
        const doc = await user.save();
        req.login(sanitizeUser(doc), (err) => {
          //this also calls serializer
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(sanitizeUser(doc), SECRET_KEY);
            res.cookie("jwt", token, {
              expires: new Date(Date.now() + 3600000),
              httpOnly: true,
            });
            res.status(201).json(token);
          }
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create the User" });
  }
};

exports.loginUser = async (req, res) => {
  res.cookie("jwt", req.user.token, {
    expires: new Date(Date.now() + 3600000),
    httpOnly: true,
  });
  res.json(req.user);
};
exports.verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    console.log("user", user);

    console.log({ email });

    if (user) {
      // res.cookie(
      //   "email",
      //   { email },
      //   {
      //     expires: new Date(Date.now() + 3600000),
      //     httpOnly: true,
      //   }
      // );
      res.status(200).json({ message: "Email verified successfully" });
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json("Internal Server Error");
  }
};
exports.checkAuth = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};
