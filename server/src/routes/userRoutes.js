const express = require('express');
const router = express.Router();
const model = require('../model/dbModel');
const User = model.User;
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const authenticateJwt = require('../middlewares/authentication.js').authenticateJwt;


const secret = 'S@cr$t';

router.post('/signup', async (req, res, next) => {
  // logic to sign up admin
  try {
    const { username, password, name } = req.body;
    const existAdmin = await User.findOne({ username, role: 'admin' });
    if (existAdmin) {
      res.status(403).json({ message: "Admin already exists" });
    }
    else {
      const newAdmin = new User({ username, password, name, role: 'admin' });
      await newAdmin.save();
      const token = jwt.sign({ id: newAdmin._id, name: name, role: 'admin' }, secret, { expiresIn: '1hr' });

      res.status(201).json({ message: "Admin created", token });
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating admin" });
    next(error);
  }
});

router.post('/auth/google', async (req, res) => {
  const client = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT_ID);
  const token = req.body.token;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_AUTH_CLIENT_ID
    });
    const payload = ticket.getPayload();
    console.log('Verified Google User', payload);
    res.status(200).json({ message: 'Token verified Successfully', user: payload });
  } catch (error) {
    console.error('Token verification error ', error);
    res.status(401).json({ message: 'Invalid Token' })
  }
})



router.post('/userSignup', async (req, res, next) => {
  try {
    const { username, password, name } = req.body;
    const existUser = await User.findOne({ username, role: 'user' });
    if (existUser)
      res.status(403).json({ message: "User already exists" });
    else {
      const newUser = new User({ username, password, name, role: 'user' });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id, name: name, role: 'user' }, secret, { expiresIn: '1hr' });
      res.status(201).json({ message: 'User Created', token });
    }
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
    next(error);
  }
})

router.post('/login', async (req, res, next) => {
  // logic to log in admin
  try {
    const { username, password } = req.headers;
    const user = await User.findOne({ username, password });
    if (user) {
      const token = jwt.sign({ id: user._id, name: user.name, role: user.role }, secret, { expiresIn: '1hr' });
      res.json({ message: "Login successful", token });
    }
    else
      res.status(403).json({ message: "Wrong credentials" });
  }
  catch (err) {
    next(err);
  }
});

router.get('/me', authenticateJwt, async (req, res, next) => {

  try {
    res.json({
      name: req.user.name
    });
  }
  catch (error) {
    next(error);
  }
})

router.get('/', authenticateJwt, async (req, res, next) => {
  try {
    let users = await User.find({ role: 'user' });
    users = users.map((user) => {
      return (
        {
          _id: user._id,
          name: user.name
        }
      )
    })
    res.json({ message: "List of admins", admins: users });
  }
  catch (err) {
    next(err);
  }
})

module.exports = router;
