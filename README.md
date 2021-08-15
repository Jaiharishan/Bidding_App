# spiderBiddingApp

This is an bidding application where users create an account in this application and bid for what ever items which are in auction.


Hackermode:

    -> This application has an public page where all items are showcased.
    -> Users can bid in the public page and also give rating for the item.
    -> In the public page there are filter and search options.
    -> User can search with the item name and the tags.
    -> User can filter by alphabetical order, price range, newest to oldest and high to low price.

    -> For each item an user can comment about it in the comments section and the user has full access to update and delete the comment.

    -> For each user and unique dashboard is there where they can see all the details about their items and their bidding history.

    -> Users can create an item, update and item and delete an item whenever they like.
    -> For selling an item in auction user should create an item and give information such as name, price, tags, image, description and duration of the auction.

    -> For uploading images and storing it in database Filepond is used.
    -> For chatting in comments section socket.io is used to feed with live replies.
    -> Also socket.io is used to show realtime bidding prices.
    -> Ratings are also shown in realtime.

    -> For each user a seperate session in created and stored in the database (mongoDB) and the session is removed once the user is logged out.
    -> Each session has an expiry time of 1 hour.

    -> This application is made using nodeJS, Express, mongoDB and packages such as
          -> bcryptjs - for hashing the user's password
          -> bootstrap - for styling the web pages
          -> connect-flash - to send flash messages to the users store in session
          -> connect-mongo-session - to create and store a session in mongoDB
          -> ejs - for view engine
          -> express - the backend framework
          -> express-ejs-layouts - layout for ejs
          -> express-session - to create a session in express
          -> mongoose - to work with mongoDB database
          -> socket.io - For realtime requests and responses
