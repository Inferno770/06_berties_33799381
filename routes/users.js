// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {
    //get the plain password from the form
    const plainPassword = req.body.password
    const saltRounds = 10

    //hash the password using bcrypt
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            return next(err)
        }

        //prepare the SQL query 
        let sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)"
        
        //organize the data to insert
        let newrecord = [
            req.body.username, 
            req.body.first, 
            req.body.last, 
            req.body.email, 
            hashedPassword
        ]

        //execute the query
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return next(err)
            }
            //sends success message
            result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email
            result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
            res.send(result)

        })
    })
})

// Export the router object so index.js can access it
module.exports = router