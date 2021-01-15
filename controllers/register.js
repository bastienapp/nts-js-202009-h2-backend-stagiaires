const express = require('express');
const cors = require('cors');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;
const router = express.Router();
const connection = require('../config/connection');

router.use(cors());

router.post('/user', (req, res) => {
  const { email, password: pwd, nom, prenom } = req.body;

  if (email === '' || pwd === '' || nom === '' || prenom === '') {
    res.status(400).send('Please specify all fields');
  } else {
    const hashpassword = bcrypt.hashSync(pwd, 10);
    connection.query(
      'INSERT INTO users (mail, password, nom, prenom) VALUE (?, ?, ?, ?)',
      [email, hashpassword, nom, prenom],
      (err, result) => {
        if (err) {
          res.status(500).json({
            error: err.message,
            sql: err.sql,
          });
        } else {
          connection.query(
            'SELECT * FROM users WHERE id=?',
            [result.insertId],
            (error, results) => {
              if (err) {
                res.status(500).json({
                  error: err.message,
                  sql: err.sql,
                });
              } else {
                const token = jwt.sign(
                  {
                    id: result.id,
                  },
                  JWT_SECRET,
                  { expiresIn: '1h' }
                );
                const { password, ...user } = results[0];
                res.status(201).json({ user, token });
              }
            }
          );
        }
      }
    );
  }
});

router.post('/company', (req, res) => {
  const {
    nom,
    adresse,
    mail,
    telephone,
    domaine,
    logo,
    password: pwd,
    logo_small,
  } = req.body;

  if (
    nom === '' ||
    adresse === '' ||
    mail === '' ||
    telephone === '' ||
    domaine === '' ||
    logo === '' ||
    pwd === '' ||
    logo_small === ''
  ) {
    res.status(400).send('Please specify all fields');
  } else {
    const hashpassword = bcrypt.hashSync(pwd, 10);
    connection.query(
      'INSERT INTO entreprises (nom, adresse, mail, telephone, domaine, logo, password, logo_small) VALUE (?, ?, ?, ?, ?, ?, ?, ?)',
      [nom, adresse, mail, telephone, domaine, logo, hashpassword, logo_small],
      (err, result) => {
        if (err) {
          res.status(500).json({
            error: err.message,
            sql: err.sql,
          });
        } else {
          connection.query(
            'SELECT * FROM entreprises WHERE id=?',
            [result.insertId],
            (error, results) => {
              if (err) {
                res.status(500).json({
                  error: err.message,
                  sql: err.sql,
                });
              } else {
                const { password, ...entreprise } = results[0];
                const token = jwt.sign(
                  {
                    id: result.id,
                  },
                  JWT_SECRET,
                  { expiresIn: '1h' }
                );
                res.status(201).json({ entreprise, token });
              }
            }
          );
        }
      }
    );
  }
});

module.exports = router;
