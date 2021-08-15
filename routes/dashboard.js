const express = require('express');
const router = express.Router();

const User = require('../modals/User').User;
const Bid = require('../modals/User').Bid;


// to check if images is of these types
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']


// to using static files
router.use(express.static('public'));


// POST requests


// POST for create
router.post('/create', (req, res) => {
    const {bidname, bidprice, duration, tagsString, biddesc, image} = req.body;

    // to split the tags seperated by commas
    tags = tagsString.split(',');

    let owner = req.session.info.user.username;

    // creating the bidders array
    let bidders = [];

    // finding if bidding item already exists with the same name
    Bid.findOne({bidname:bidname})
        .then(bidd => {
            if (bidd) {
                req.flash('warning_msg', 'The item with the same name already exists');
                res.redirect('/app/dashboard');
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
                        res.redirect('/app/dashboard');

                    })
                    .catch(err => console.log(err));

                            
            }
        })
        .catch(err => console.log(err));

});



// to read the image data an save it in buffer format
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
            res.redirect('/app/dashboard');
            
        })
        .catch(err => console.log(err));
})



// POST for update
router.post('/update', (req, res) => {
    
    // getting all required values from the form
    const {itemname, bidname, bidprice, duration, tagsString, biddesc, image} = req.body;

    tags = tagsString.split(',')

    Bid.findOne({bidname: bidname})
        .then(bid => {
            if (bid) {

                if (bid.bidname !== itemname) {
                    req.flash('warning_msg', 'The item with the same name already exists');
                    res.redirect('/app/dashboard');

                }else {

                    const updatedItem = {
                        bidname,
                        bidprice,
                        duration,
                        tags,
                        biddesc
                    }
                    saveImage(updatedItem, image)

                    Bid.findOneAndUpdate({bidname: itemname}, updatedItem).then(bidd => {
    
                        res.redirect('/app/dashboard')
    
                    }).catch(err => console.log(err));
    
                }
            }else {

                const updatedItem = {
                    bidname,
                    bidprice,
                    duration,
                    tags,
                    biddesc
                }
                saveImage(updatedItem, image)

                Bid.findOneAndUpdate({bidname: itemname}, updatedItem).then(bidd => {

                    res.redirect('/app/dashboard')

                }).catch(err => console.log(err));
            }
            
        })
        .catch(err=> console.log(err))

})



module.exports = router;