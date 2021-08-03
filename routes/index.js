const express = require('express');
const router = express.Router();

const User = require('../modals/User').User;
const Bid = require('../modals/User').Bid;


router.use(express.static('public'));

// GET requests
router.get('/', (req, res) => {
    res.render('app');
})


router.get('/app', (req, res) => {
    res.render('app', {user, bids});
})



// POST requests



router.post('/app', (req, res) => {
    const {bidname, bidprice, duration, email} = req.body;


    User.findOne({email: email})
        .then(user => {
            if (user) {
                let owner = user.username;
                let bidders = [];

                Bid.findOne({bidname:bidname})
                    .then(bidd => {
                        if (bidd) {
                            console.log('item already exists')
                        }else {
                            const newBid = new Bid({
                                bidname,
                                bidprice,
                                duration,
                                owner,
                                bidders
                            })
            
                            newBid.save()
                                .then(bid => {console.log(bid)})
                                .catch(err => console.log(err))
                        }
                    })
                    .catch(err => console.log(err));


                Bid.find({}, (err, bids) => {
                    if (err) {
                        res.send('something went wrong');
                    }

                    res.render('app', {
                        user,
                        bids
                    })
                    // console.log('this rendered')
                })
            }
        })
        .catch(err => console.log(err));

})




module.exports = router;