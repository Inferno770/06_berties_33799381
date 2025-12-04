const express = require("express")
const router = express.Router()

router.get('/books', function (req, res, next) {

    // Start with the base query
    let sqlquery = "SELECT * FROM books"
    
    let conditions = []
    let params = []

    // --- SEARCH PARAMETER ---
    if (req.query.search) {
        conditions.push("name LIKE ?")
        params.push('%' + req.query.search + '%')
    }

    if (req.query.minprice) {
        conditions.push("price >= ?")
        params.push(req.query.minprice)
    }
    
    if (req.query.max_price) {
        conditions.push("price <= ?")
        params.push(req.query.max_price)
    }

    // Combine the conditions into the query
    if (conditions.length > 0) {
        sqlquery += " WHERE " + conditions.join(" AND ")
    }

    // --- TASK 5: SORT PARAMETER ---
    if (req.query.sort) {
        // SECURITY CHECK: only allow sorting by specific fields
        const allowedSorts = ['name', 'price', 'id']
        
        if (allowedSorts.includes(req.query.sort)) {
            sqlquery += " ORDER BY " + req.query.sort
        }
    }

    // Execute the final built query
    db.query(sqlquery, params, (err, result) => {
        if (err) {
            res.json(err)
            next(err)
        }
        else {
            res.json(result)
        }
    })
})

module.exports = router