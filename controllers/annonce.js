const router = require('express').Router();

const authenticateWithJsonWebToken = require('../middleware');
const Annonce = require('../models/Annonce');

router.get('/', authenticateWithJsonWebToken, async (req, res) => {
  const { langage } = req.query;
  try {
    const allAnnonces = await Annonce.findAllAnnonces(langage);

    if (!allAnnonces.length) {
      return res.status(204).json({
        success: false,
        message: 'No announcements.',
      });
    }

    return res.status(200).json({
      success: true,
      annonces: allAnnonces,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      sqlMessage: error.sqlMessage,
      sql: error.sql,
    });
  }
});

router.get('/:id', authenticateWithJsonWebToken, async (req, res) => {
  const { id } = req.params;

  try {
    const annonce = await Annonce.findOneById(id);

    if (!annonce) {
      return res.status(204).json({
        success: false,
        message: 'No announcement.',
      });
    }

    return res.status(200).json({
      success: true,
      annonce,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      sqlMessage: error.sqlMessage,
      sql: error.sql,
    });
  }
});

module.exports = router;
