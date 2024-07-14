// server/routes/historicalPrices.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const router = express.Router();

router.get('/historical-prices', (req, res) => {
    const { shape } = req.query;

    const results = [];
    fs.createReadStream(path.join(__dirname, '..', 'realtime_diamonds.csv'))
      .pipe(csv())
      .on('data', (data) => {
        if (data.Shape.toLowerCase() === shape.toLowerCase()) {
            const dateOnly = data.Date.split(' ')[0];
          const priceWithoutComma = data.Price.replace(/,/g, '');
          results.push({ Date: dateOnly, Price: parseFloat(priceWithoutComma) });
        }
      })
      .on('end', () => {
        res.json(results);
      });
  });
  
  module.exports = router;
