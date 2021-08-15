const express = require('express');
const router = express.Router();


// to use static files like css, scss and js
router.use(express.static('public'));


// login page will be shown first
// GET requests
router.get('/', (req, res) => {
    res.render('login');
})


module.exports = router;