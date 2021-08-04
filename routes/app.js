const express = require('express');
const router = express.Router();

const User = require('../modals/User').User;
const Bid = require('../modals/User').Bid;


router.use(express.static('public'));


router.get('/', (req, res) => {
    res.render('app', info);
})



router.get('/dashboard', (req, res) => {
    res.render('dashboard', info);
})


router.post('/', (req, res) => {
    const {bidname, bidprice, duration, tagsString, email} = req.body;

    console.log(tagsString);
    tags = tagsString.split(',');
    // tags = ['ancient, gold', 'royal'];

    User.findOne({email: email})
        .then(user => {
            if (user) {
                let owner = user.username;
                let bidders = [];

                Bid.findOne({bidname:bidname})
                    .then(bidd => {
                        if (bidd) {
                            console.log('item already exists');
                        }
                        else {
                            const newBid = new Bid({
                                bidname,
                                bidprice,
                                duration,
                                owner,
                                tags,
                                bidders
                            })
                            
                            newBid.save()
                                .then(bid => {console.log(bid)})
                                .catch(err => console.log(err));

                            
                        }
                    })
                    .catch(err => console.log(err));


                Bid.find({}, (err, bids) => {
                    if (err) {
                        res.send('something went wrong');
                    }

                    info = {
                        user,
                        bids
                    }

                    res.render('dashboard', info);

                })
            }
        })
        .catch(err => console.log(err));

});


router.post('/dashboard', (req, res) => {
    const {itemname} = req.body;
    console.log(itemname);
    Bid.findOneAndDelete({bidname: itemname})
        .then(bid => {
            console.log(bid);


            Bid.find({}, (err, bids) => {
                if (err) {
                    res.send('something went wrong');
                }

                info.bids = bids

                res.render('dashboard', info);

            })



        })
        .catch(err => console.log(err));
   
})


module.exports = router;
