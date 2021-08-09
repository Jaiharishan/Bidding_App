const express = require('express');
const router = express.Router();

const User = require('../modals/User').User;
const Bid = require('../modals/User').Bid;

const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// to using static files
router.use(express.static('public'));


// POST requests


// POST for create
router.post('/create', (req, res) => {
    const {bidname, bidprice, duration, tagsString, biddesc, image, username} = req.body;

    // to split the tags seperated by commas
    tags = tagsString.split(',');

    let owner = username;

    // creating the bidders array
    let bidders = [];

    // finding if bidding item already exists with the same name
    Bid.findOne({bidname:bidname})
        .then(bidd => {

            // if exists the send a warning msg
            if (bidd) {
                console.log('item already exists');
            }

            // else create a new bid item and save it to the data base
            else {
                const newBid = new Bid({
                        bidname,
                        bidprice,
                        duration,
                        owner,
                        tags,
                        biddesc,
                        bidders
                })
                
                saveImage(newBid, image)

                // after saving successfully update the existing bidding details
                newBid.save()
                    .then(bid => {

                        Bid.find({}, (err, bids) => {
                            if (err) {
                                res.send('something went wrong');
                            }
                            
                            let user = req.session.info.user
                            res.render('dashboard', {
                                user: user,
                                bids: bids
                            })
                            
                        })

                    })
                    .catch(err => console.log(err));

                            
            }
        })
        .catch(err => console.log(err));

});


function saveImage(newbid, imageEncoded) {
    if (imageEncoded == null) return
    const img = JSON.parse(imageEncoded);
     if (img != null && imageMimeTypes.includes(img.type)) {
        newbid.image = new Buffer.from(img.data, 'base64');
        newbid.imagetype = img.type;
     }
}


// POST for delete
router.post('/delete', (req, res) => {

    // getting the itemname of the item to delete it
    const {itemname} = req.body;
    

    // now using mongodb findone and delete method we delete the item and update the page
    Bid.findOneAndDelete({bidname: itemname})
        .then(bid => {
            
            Bid.find({}, (err, bids) => {
                if (err) {
                    res.status('404').send('something went wrong');
                }

                let user = req.session.info.user
                res.render('dashboard', {
                    user: user,
                    bids: bids
                })

            })
        })
        .catch(err => console.log(err));
   
})



// POST for update
router.post('/update', (req, res) => {
    
    // getting all required values from the form
    const {itemname, bidname, bidprice, duration, tagsString, biddesc} = req.body;

    tags = tagsString.split(',')


    Bid.findOne({bidname: bidname})
        .then(bid => {
            if (bid) {
                req.flash('warning_msg', 'The item with the same name already exists');
                res.redirect('/app/dashboard');
            }else {
                Bid.findOneAndUpdate({bidname: itemname},

                    {
                        bidname,
                        bidprice,
                        duration,
                        tags,
                        biddesc
                    })
                    .then(bidd => {
                                
                        Bid.find({}, (err, bids) => {
                            if (err) {
                                res.status('404').send('something went wrong');
                            }
                    
                            let user = req.session.info.user
                            res.render('dashboard', {
                                user: user,
                                bids: bids
                            })
                    
                        })
                    
                    })
                    .catch(err => console.log(err))

            }
        })


    // using itemname we find the required item nd update it with the given details
    

})


router.post('/', (req, res) => {

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


module.exports = router;