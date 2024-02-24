const passport = require("passport");
exports.isAuth = (req, res, done) => {
  return passport.authenticate("jwt");
};
exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjNiZjA5ZjE0ZDE4ZTYyYmUwMDE1NSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzA2Mjc4NjY1fQ.b7LJV0QWJ4tzoizyT6KEKt8GB_X8Js9nssmjG5uJFjc";
  return token;
};
