// Create a new router
const express = require("express")
const router = express.Router()
const request = require('request')

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
        res.redirect('./users/login') 
    } else { 
        next (); 
    } 
}

// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
});

router.get('/about',function(req, res, next){
    res.render('about.ejs')
});

router.get('/weather', function(req, res, next){
    let city = req.query.city; 
    let apiKey = process.env.WEATHER_API_KEY;

    if (!city) {
        return res.render('weather.ejs', { weather: null, error: null });
    }

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
             
    request(url, function (err, response, body) {
        if(err){
            next(err);
        } else {
            // 1. Parse the body string into a JSON object
            let weather = JSON.parse(body);

            if (weather !== undefined && weather.main !== undefined) {
                res.render('weather.ejs', { weather: weather, error: null });
            } 
            else {
                // Failure: The API returned something, but not weather data 
                res.render('weather.ejs', { weather: null, error: "No data found" });
            }
        } 
    });
});

router.get('/logout', redirectLogin, (req,res) => {
        req.session.destroy(err => {
        if (err) {
          return res.redirect('./')
        }
        res.send('you are now logged out. <a href='+'./'+'>Home</a>');
        })
    })

// Export the router object so index.js can access it
module.exports = router