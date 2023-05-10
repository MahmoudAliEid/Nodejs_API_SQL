const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = require("../config/user");
const authKeys = require("./authKeys");

const filterJson = (obj, unwantedKeys) => {
  const filteredObj = {};
  Object.keys(obj).forEach((key) => {
    if (unwantedKeys.indexOf(key) === -1) {
      filteredObj[key] = obj[key];
    }
  });
  return filteredObj;
};

passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // define the parameter in req.body that passport can use as username and password
      passwordField: "password",
    },
    function (email, password, done) {
      User.findOne({
        where: {
          email: email,
        },
      }).then(function (user) {
        if (user == null) {
          return done(null, false, { message: "Incorrect credentials." });
        }

        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            return done(null, false, { message: "Some error occured." });
          }
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect credentials." });
          }
        });
      });
    }
  )
);
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: authKeys.jwtSecretKey,
    },
    (jwt_payload, done) => {
      User.findByPk(jwt_payload._id)
        .then((user) => {
          // console.log(Object.keys(jwt_payload));
          if (!user) {
            return done(null, false, {
              message: "JWT Token does not exist",
            });
          }
          // console.log(user);
          // user["uid"] = filterJson(user["_doc"], ["password", "__v"]);
          return done(null, user);
        })
        .catch((err) => {
          return done(err, false, {
            message: "Incorrect Token",
          });
        });
    }
  )
);

module.exports = passport;
