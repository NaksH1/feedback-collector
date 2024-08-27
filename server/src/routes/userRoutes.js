const express = require('express');
const router = express.Router();
const model = require('../model/dbModel');
const User = model.User;
const jwt = require('jsonwebtoken');
const secret = 'S@cr$t';

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const existUser = await User.findOne({ username });
  if (existUser)
    res.status(403).json({ message: "User already present" });
  else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ id: newUser.id, username: username, role: 'user' }, secret, { expiresIn: '1hr' });
    res.status(200).json({ message: "User Created", token });
  }
});

router.post('/login', async (req, res) => {
  const user = req.headers;
  const exist = await User.findOne({ username: user.username, password: user.password });
  if (exist) {
    const token = jwt.sign({ id: exist.id, username: user.username, role: 'user' }, secret, { expiresIn: '1hr' });
    res.json({ message: "Login successful", token });
  }
  else
    res.status(403).json({ message: "Wrong credentials" });
});

module.exports = router;
