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
    const parentDir = req.params.id;
    if (fs.existsSync(path.join(__dirname, `../snapshots/${parentDir}`))) {

        dbhandler.qDelete.row('reports', `WHERE test_uuid = '${parentDir}'`)
            .then(response => { console.log('URL RESPONSE', response); return response; })
            .then(() => {
                dbhandler.qDelete.row('tests', `WHERE uuid = '${parentDir}'`)
                    .then(response => { console.log('URL RESPONSE', response); return response; })
                    .then(response => {
                        if (response && response !== undefined && response[0]) {
                            return response;
                        } else {
                            return -1;
                        }
                    });
            });
        fs.rmSync(path.join(__dirname, `../snapshots/${parentDir}`), { recursive: true, force: true });

        res.redirect('/view-test');
    } else {
        next({ message: "Sorry, this test was not found" });
    }
});
module.exports = router;