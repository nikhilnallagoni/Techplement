const express = require("express");
const {
  registerUser,
  loginUser,
  profile,
  logout,
} = require("../controllers/userController");
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", profile);
router.post("/logout", logout);
module.exports = router;
