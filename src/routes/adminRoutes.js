const express = require('express');
const router = express.Router();
const model = require('../model/dbModel');
const Admin = model.Admin;
const jwt = require('jsonwebtoken');
const secret = 'S@cr$t';

router.post('/signup', async (req, res, next) => {
  // logic to sign up admin
  try {
    const { username, password } = req.body;
    const existAdmin = await Admin.findOne({ username });
    if (existAdmin) {
      res.status(403).json({ message: "Admin already exists" });
    }
    else {
      const newAdmin = new Admin({ username, password });
      await newAdmin.save();
      const jwtToken = jwt.sign({ id: newAdmin.id, username: username, role: 'admin' }, secret, { expiresIn: '1hr' });

      res.status(201).json({ message: "Admin created", jwtToken });
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating admin" });
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  // logic to log in admin
  try {
    const { username, password } = req.headers;
    const admin = await Admin.findOne({ username, password });
    if (admin) {
      const token = jwt.sign({ id: admin.id, username: username, role: 'admin' }, secret, { expiresIn: '1hr' });
      res.json({ message: "Login successful", token });
    }
    else
      res.status(403).json({ message: "Wrong credentials" });
  }
  catch (err) {
    next(err);
  }
});

module.exports = router;
