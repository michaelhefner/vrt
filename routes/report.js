var express = require("express");
var router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const backstop = require("../middleware/backstop/index.js");
const config = require('../default.json');
const fs = require('fs');
const path = require('path');
const dbhandler = require('../middleware/db/handler');
const { v4: uuidv4 } = require('uuid');


router.get('/:id', requiresAuth(), (req, res, next) => {
    res.redirect(`/report/${req.params.id}/backstop_data/html_report/test-index`)
})

router.get("/*/backstop_data/html_report/test-index",requiresAuth(), function(req, res, next) {
    const param = req.url.slice(req.url.indexOf('?')+1);
    const folder = req.url.replace('/report', 'snapshots').replace('test-index', 'index.html').replace(`?${param}`, '');
    const fileExists =  fs.existsSync(`${folder}`);
    res.render("test-index", {
        title: "Report",
        user: req.oidc.user,
        exists: fileExists,
    });
});
module.exports = router;