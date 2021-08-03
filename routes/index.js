const express = require('express');
const router = express.Router();

const User = require('../modals/User').User;
const Bid = require('../modals/User').Bid;


router.use(express.static('public'));

// GET requests
router.get('/', (req, res) => {
    res.render('app');
})


// POST requests
// router.post('/app/bid', (req, res) => {

// })

router.post('/app/create', (req, res) => {
    const {bidname, bidprice, duration} = req.body;
})




module.exports = router;