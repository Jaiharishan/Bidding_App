const express = require('express');
const router = express.Router();

const User = require('../modals/User').User;
const Bid = require('../modals/User').Bid;


router.use(express.static('public'));


// POST requests


// POST for create
router.post('/create', (req, res) => {
    const {bidname, bidprice, duration, tagsString, email} = req.body;

    tags = tagsString.split(',');

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

                    info.user = user;
                    info.bids = bids;

                    res.render('dashboard', info);

                })
            }
        })
        .catch(err => console.log(err));

});



// POST for delete
router.post('/delete', (req, res) => {

    const {itemname} = req.body;
    
    Bid.findOneAndDelete({bidname: itemname})
        .then(bid => {
            
            Bid.find({}, (err, bids) => {
                if (err) {
                    res.status('404').send('something went wrong');
                }
                info.bids = bids

                res.render('dashboard', info);

            })
        })
        .catch(err => console.log(err));
   
})



// POST for update
router.post('/update', (req, res) => {
    
    const {itemname, bidname, bidprice, duration, tagsString} = req.body;

    tags = tagsString.split(',')
    Bid.findOneAndUpdate({bidname: itemname},
        {
            bidprice: bidprice,
            duration: duration,
            tags: tags,
        })
        .then(bid => {
            if(bid) {
                console.log(bid);
            }
            
            Bid.find({}, (err, bids) => {
                if (err) {
                    res.status('404').send('something went wrong');
                }

                info.bids = bids

                res.render('dashboard', info);

            })

        })
        .catch(err => console.log(err))

})
module.exports = router;