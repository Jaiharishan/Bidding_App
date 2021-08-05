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



// POST router to get bids and bidders
router.post('/', (req, res) => {
    const {bidAmount, itemname, username} = req.body;
    console.log(bidAmount, itemname);
    Bid.findOneAndUpdate({bidname: itemname},
        {
            bidprice: bidAmount,
            $push: {
                bidders: {username: username, bidAmount: bidAmount}
            }
        })
        .then(bid => {
            if(bid) {
                console.log(bid);
            }
            
            Bid.find({}, (err, bids) => {
                if (err) {
                    res.status('404').send('something went wrong');
                }

                info.bids = bids;

                res.render('app', info);

            })

        })
        .catch(err => console.log(err))
        

})


module.exports = router;
