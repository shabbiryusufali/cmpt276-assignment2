/*
 I used http://expressjs.com/en/resources/middleware/body-parser.html for the 
 bodyParser for Assignment 2. Aside from that I referenced class content ( YT videos)
 and the Heroku Getting Started Tutorial. for the ejs files I references W3Schools for
 a few elements such as input and label
*/
const cool = require('cool-ascii-faces');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

express()
    .use(express.static(path.join(__dirname, 'public')))
    .get('/times', (req, res) => res.send(showTimes()))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .get('/cool', (req, res) => res.send(cool()))
    .get('/db', async(req, res) => {
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT * FROM test_table');
            const results = { 'results': (result) ? result.rows : null };
            res.render('pages/db', results);
            client.release();
        } catch (err) {
            console.error(err);
            res.send("Error " + err);
        }
    })
    .get('/rectangleTable', async(req, res) => {
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT * FROM rectangle_table ORDER BY name ASC');
            const results = { 'results': (result) ? result.rows : null };
            var whoIsOwner = 'All';
            res.render('pages/rectangleTable', { data: results, owner: whoIsOwner });
            client.release();
        } catch (err) {
            console.error(err);
            res.send("Error " + err);
        }
    })

.get('/rectangleTable/:OWNER', async(req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM rectangle_table WHERE owner='${req.params.OWNER}' ORDER BY name ASC;`);
        const results = { 'results': (result) ? result.rows : null };
        var whoIsOwner = req.params.OWNER;
        res.render('pages/rectangleTable', { data: results, owner: whoIsOwner });
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
})

.post('/deleteItem/:ID', (req, res) => {
        try {
            var idToDelete = req.params.ID;
            var deleteQuery = `DELETE FROM rectangle_table WHERE id=${idToDelete};`;
            pool.query(deleteQuery);
            res.redirect('/rectangleTable');
        } catch (err) {
            console.log(err);
            res.send("Error " + err);
        }

    })
    .post('/addItem', urlencodedParser, async(req, res) => {
        try {
            const client = await pool.connect();
            const result = await client.query(`SELECT * FROM rectangle_table ORDER BY name ASC;`);
            const results = { 'results': (result) ? result.rows : null };
            var name = req.body.name;
            var color = req.body.color;
            var width = req.body.width;
            if (width > 2147483646) { //MAX INTEGER FOR POSTGRES
                console.log("Error: Big Number Detected for Width");
                res.send("Error: width is too big");
            }
            var height = req.body.height;
            if (height > 2147483646) {
                console.log("Error: Big Number Detected for Height");
                res.send("Error: height is too big");
            }
            var id = req.body.id;
            if (height > 2147483646) {
                console.log("Error: Big Number Detected for ID");
                res.send("Error: ID is too big");
            }
            var bordercolor = req.body.bordercolor;
            var owner = req.body.owner;
            var gradient = req.body.gradient;
            var addQuery = `INSERT INTO rectangle_table VALUES ('${name}','${color}',${width},${height},${id},'${bordercolor}','${owner}', ${gradient});`;
            var foundID = false;
            results.results.forEach(function(r) {
                if (r.id == req.body.id) {
                    console.log(r);
                    console.log("An ID was entered that already exists in the table!");
                    res.send("Error: That ID is already used!");
                    foundID = true;
                }
            });
            if (foundID == false) {
                pool.query(addQuery);
            }
            res.redirect('/rectangleTable');
        } catch (err) {
            console.log(err);
            res.send("Error " + err);
        }

    })

.post('/updateItem/:ID', urlencodedParser, (req, res) => {
        try {
            var id = req.params.ID;
            var name = req.body.name;
            var color = req.body.color;
            var keepcolorsame = req.body.keepcolorsame;
            var width = req.body.width;
            var height = req.body.height;
            var bordercolor = req.body.bordercolor;
            var keepbordersame = req.body.keepbordersame;
            var owner = req.body.owner;
            var gradient = req.body.gradient;
            if (name) {
                pool.query(`UPDATE rectangle_table SET name='${name}' WHERE id=${id};`);
            }
            if (color && keepcolorsame) {
                pool.query(`UPDATE rectangle_table SET color='${color}' WHERE id=${id};`);
            }
            if (width) {
                pool.query(`UPDATE rectangle_table SET width='${width}' WHERE id=${id};`);
            }
            if (height) {
                pool.query(`UPDATE rectangle_table SET height='${height}' WHERE id=${id};`);
            }
            if (bordercolor && keepbordersame) {
                pool.query(`UPDATE rectangle_table SET bordercolor='${bordercolor}' WHERE id=${id};`);
            }
            if (owner) {
                pool.query(`UPDATE rectangle_table SET owner='${owner}' WHERE id=${id};`);
            }
            if (gradient) {
                pool.query(`UPDATE rectangle_table SET gradient='${gradient}' WHERE id=${id};`);
            }
            res.redirect(`/rectangle/${id}`);
        } catch (err) {
            console.log(err);
            res.send("Error " + err);
        }

    })
    .get('/rectangle/:ID', async(req, res) => {
        try {
            const client = await pool.connect();
            const result = await client.query(`SELECT * FROM rectangle_table WHERE id=${req.params.ID};`);
            const results = { 'results': (result) ? result.rows : null };
            res.render('pages/rectangle', results);
            client.release();

        } catch (err) {
            console.log(err);
            res.send("Error " + err);
        }

    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));


showTimes = () => {
    let result = '';
    const times = process.env.TIMES || 5;
    for (i = 0; i < times; i++) {
        result += i + ' ';
    }
    return result;
}