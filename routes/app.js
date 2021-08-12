const express = require('express');
const router = express.Router();

const User = require('../modals/User').User;
const Bid = require('../modals/User').Bid;


// to using static files
router.use(express.static('public'));


const isAuth = (req, res, next) => {
    if (req.session.auth) {
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

    let user = req.session.info.user;
    Bid.find({owner: user.username}, (error, bids) => {
        if (error) {
            res.send('something went wrong')
        }

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


// GET route for searching
router.get('/search', (req, res) => {

    const {search} = req.query;

    console.log(req.query);

    let regex = new RegExp(search, 'i');

    Bid.find({$or: [

        {bidname:regex},

         {tags: {$in :[regex]}}
        ]})
        .then(bids => {

            let user = req.session.info.user;

            res.render('search', {
                search,
                user,
                bids
            });
        })
})


// GET route for filter
router.get('/filter', (req, res) => {

    const {alphabet, range, lowtohigh, newest} = req.query;
    // console.log("1"+ alphabet, "2" + range, "3" + maxbid, "4" + lowtohigh, "5" + newest)


    if(alphabet) {
        Bid.find({bidprice: {$lt: range}}).collation({locale: "en" }).sort({bidname:1})
            .then(bids => {
                let user = req.session.info.user;
                res.render('filters', {
                    user,
                    bids
                })
            })
            .catch(err => console.log(err));

        
    }
    if(lowtohigh) {
        Bid.find({bidprice: {$lt: range}}).sort({bidprice:1})
            .then(bids => {
                let user = req.session.info.user;
                res.render('filters', {
                    user,
                    bids
                })

            })
            .catch(err => console.log(err));


    }
    if (newest) {
        Bid.find({bidprice: {$lt: range}}).sort({date:-1})
            .then(bids => {
                let user = req.session.info.user;
                res.render('filters', {
                    user,
                    bids
                })

            })
            .catch(err => console.log(err));


    }
    




})


router.post('/logout', (req, res) => {
    
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/user/login');
        
    })
})



module.exports = router;
