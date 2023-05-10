const uuid = require("uuid");
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const authKeys = require("../lib/authKeys");
const User = require("../config/user");
const Admin = require("../config/admin");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const user_data = {
      uid: uuid.v4(),
      email: data.email,
      password: data.password,
      type: data.type,
    };

    await User.create(user_data);

    if (data.type === "Admin") {
      await Admin.create({
        rid: user_data.uid,
        name: data.name,
        contactNumber: data.contactNumber,
        bio: data.bio,
      });
    }

    const token = jwt.sign({ _id: user_data.uid }, authKeys.jwtSecretKey);
    res
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .json({
        token: token,
        type: user_data.type,
      });
  } catch (err) {
    if (data.type === "Admin" && user_data.uid) {
      await User.destroy({ where: { uid: user_data.uid } });
    }
    res.status(400).json({ error: err });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401).json(info);
        return;
      }
      const token = jwt.sign({ _id: user.uid }, authKeys.jwtSecretKey);
      res
        .cookie("token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })
        .json({
          token: token,
          type: user.type,
        });
    }
  )(req, res, next);
});
router.get("/logout", (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      message: "You are Logout successfully!",
    });
});

module.exports = router;
