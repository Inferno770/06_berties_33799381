// Create a new router
const express = require("express")
const router = express.Router()

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
        res.redirect('../users/login') // Redirect to the user login page
    } else { 
        next (); // Move to the next middleware function
    } 
}

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search-result', function (req, res, next) {
    //get the keyword from the form's <input name="search_text">
    const keyword = req.sanitize(req.query.search_text);
    
    //create the SQL query with the LIKE operator for partial matching
    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";
    
    //create the search term for the 'LIKE' query. 
    //the '%' is a wildcard, so '%World%' finds any text containing "World".
    const searchTerm = '%' + keyword + '%';

    //this executes the query
    db.query(sqlquery, [searchTerm], (err, result) => {
        if (err) {
            return next(err);
        }
        
        //render the same list.ejs template, passing in our
        //search results. so it will be nicely formatted.
        res.render("list.ejs", { availableBooks: result });
    });
});

router.get('/list', redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableBooks:result})
    });
});

router.get('/bargainbooks', function(req, res, next) {
    //new SQL query to get books priced less than 20
    let sqlquery = "SELECT * FROM books WHERE price < 20"; 
    
    //execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            return next(err); // Handle errors
        }
        
        //we re-use the 'list.ejs' template
        res.render("list.ejs", {availableBooks: result});
    });
});

router.get('/addbook', redirectLogin, function(req, res, next) {
    res.render("addbook.ejs");
});

router.post('/bookadded', redirectLogin, function (req, res, next) {
    //saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
    
    //get data from the form's <input> fields
    let newrecord = [
        req.sanitize(req.body.name), 
        req.body.price
    ];
    
    //execute sql query
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            return next(err);
        }
        //send this message back to the browser
        res.send('This book is added to database, name: ' + req.body.name + ', price ' + req.body.price);
    });
});

// Export the router object so index.js can access it
module.exports = router
