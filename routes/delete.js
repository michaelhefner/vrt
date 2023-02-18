var express = require("express");
var router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const backstop = require("../middleware/backstop/index.js");
const config = require('../default.json');
const fs = require('fs');
const path = require('path');
const dbhandler = require('../middleware/db/handler');
const { v4: uuidv4 } = require('uuid');

/*
Delete endpoint using the test id 
*/
router.get("/:id", requiresAuth(), (req, res, next) => {
    const parentDir = req.params.id.replaceAll('/', '_');
    if (fs.existsSync(path.join(__dirname, `../snapshots/${parentDir}`))) {
        const rows = dbhandler.select.query('urls', '*', `WHERE url = '${req.params.id.replaceAll('_', '/')}'`);
        rows.then((results) => {
            console.log('*** RESULTS ***', results);
            if (results.length > 0) {
                for (let each of results) {
                    dbhandler.qDelete('tests', `WHERE test_url_id = ${each.id}`)
                        .then(response => { console.log('URL RESPONSE', response); return response; })
                        .then(response => {
                            if (response && response !== undefined && response[0]) {
                                return response;
                            } else {
                                return -1;
                            }
                        });
                }
            } else {
                console.log('** No rows found in the database **');
            }
        });
        fs.rmSync(path.join(__dirname, `../snapshots/${parentDir}`), { recursive: true, force: true });

        res.redirect('/view-test');
    } else {
        next({ message: "sorry this test was not found" });
    }
});
module.exports = router;