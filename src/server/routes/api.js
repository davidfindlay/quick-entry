const express = require('express');
const router = express.Router();

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

/* GET api listing. */
router.get('/authenticate', (req, res) => {

  // var params = JSON.parse(req.getBody());

  res.send('authenicate works');
});


module.exports = router;
