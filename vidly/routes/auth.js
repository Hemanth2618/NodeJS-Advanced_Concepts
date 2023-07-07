const {User} = require('../models/user');
const express = require('express');
const _ = require('lodash')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Joi = require("joi");
const config = require('config');
const {Schema} = require("mongoose/lib/browser");
const router = express.Router();


router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password');

  const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, config.get('jwtPrivateKey'));
  res.send(token);

  res.send(true);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Schema.validate(req, schema);
}

module.exports = router;