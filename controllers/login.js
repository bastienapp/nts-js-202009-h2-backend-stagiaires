const express = require('express');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const router = express.Router();
const connection = require('../config/connection');

const { JWT_SECRET } = process.env;

router.post('/', (req, res) => {
  const { email, password } = req.body;
  if (email === '' || password === '') {
    res.status(400).send('Please specify your email or password');
  } else {
    connection.query(
      'SELECT * FROM users WHERE mail=?',
      [email],
      (err, result) => {
        if (err) {
          res.status(500).json({
            error: err.message,
            sql: err.sql,
          });
        } else if (result.length === 0) {
          res.status(403).send('Invalid email');
        } else if (bcrypt.compareSync(password, result[0].password)) {
          const token = jwt.sign(
            {
              id: result.id,
            },
            JWT_SECRET,
            { expiresIn: '1h' }
          );
          const user = {
            id: result[0].id,
            email,
            password: 'hidden',
          };
          res.status(200).json({ user, token });
        } else {
          res.status(403).send('invalid password');
        }
      }
    );
  }
});

module.exports = router;