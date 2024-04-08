const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const secret = "miniproject";

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id, username) => {
  return jwt.sign({ id, username }, secret, {
    expiresIn: maxAge,
  });
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "All fields are mandatory" });
    return;
  }

  const userAvailable = await User.findOne({ username });
  if (userAvailable) {
    res.status(400).json({ error: "User already registered!" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username: username,
    password: hashedPassword,
  });

  if (!user) {
    res.status(400).json({ error: "Failed to create user" });
    return;
  }

  const token = createToken(user._id, user.username);
  res.cookie("token", token, {
    maxAge: maxAge * 1000,
    httpOnly: true,
  });
  console.log(token);
  res.status(200).json({ id: user._id.toString(), username: user.username });
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "All fields are mandatory" });
    return;
  }

  const userDoc = await User.findOne({ username: username });
  if (!userDoc) {
    res.status(400).json({ error: "User not found" });
    return;
  }

  const passOk = await bcrypt.compare(password, userDoc.password);
  if (!passOk) {
    res.status(400).json({ error: "Invalid credentials" });
    return;
  }

  const token = createToken(userDoc._id, userDoc.username);
  res.cookie("token", token, {
    maxAge: maxAge * 1000,
    httpOnly: true,
  });

  res.status(200).json({ id: userDoc._id, username: userDoc.username });
});

const profile = asyncHandler((req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  jwt.verify(token, secret, {}, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.json({ id: decoded.id, username: decoded.username });
  });
});

const logout = asyncHandler((req, res) => {
  res.cookie("token", "", { maxAge: 1 });
  res.json({ success: true });
});

module.exports = { registerUser, loginUser, profile, logout };
