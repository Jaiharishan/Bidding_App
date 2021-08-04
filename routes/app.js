const express = require('express');
const router = express.Router();

const User = require('../modals/User').User;
const Bid = require('../modals/User').Bid;


router.use(express.static('public'));


// GET request for app route (public page)
router.get('/', (req, res) => {
    res.render('app', info);
})


// GET request for user profile
router.get('/dashboard', (req, res) => {
    res.render('dashboard', info);
})


module.exports = router;
