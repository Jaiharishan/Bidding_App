const express = require('express');
const router = express.Router();

const User = require('../modals/User').User;
const Bid = require('../modals/User').Bid;


// to using static files
router.use(express.static('public'));


const isAuth = (req, res, next) => {
    if (req.session.auth) {
        console.log('logged in');
        next()
    }else {
        res.redirect('/user/login')
    }
}




// GET request for app route (public page)
router.get('/', isAuth, (req, res) => {

    Bid.find({}, (error, bids) => {
        if (error) {
            res.send('something went wrong')
        }

        let user = req.session.info.user;

        res.render('app', {
            user: user,
            bids: bids
            })
    })
})


// GET request for user profile
router.get('/dashboard', isAuth, (req, res) => {

    Bid.find({}, (error, bids) => {
        if (error) {
            res.send('something went wrong')
        }

        let user = req.session.info.user;

        res.render('dashboard', {
            user: user,
            bids: bids
            })
    })
})


// POST router to get bids and bidders
router.post('/', (req, res) => {

    // getting the updated amount itemname and the bidder name
    const {bidAmount, itemname, username} = req.body;

    // now we search through the bid schema and find the item with itemname
    Bid.findOneAndUpdate({bidname: itemname},

        {
            bidprice: bidAmount,

            // pushing the username and bidding amount to the existing array
            $push: {
                bidders: {username: username, bidAmount: bidAmount}
            }
        })
        .then(bid => {
            
            res.redirect('/app');

        })
        .catch(err => console.log(err))
        
})


router.post('/logout', (req, res) => {
    
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/user/login');
        
    })
})



module.exports = router;
