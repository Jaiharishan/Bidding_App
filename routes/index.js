const express = require('express');
const router = express.Router();

const User = require('../modals/User').User;
const Bid = require('../modals/User').Bid;


// to use static files like css, scss and js
router.use(express.static('public'));

// GET requests
router.get('/', (req, res) => {
    res.render('register');
})


module.exports = router;