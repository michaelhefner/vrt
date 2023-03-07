var express = require("express");
var router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const fs = require('fs');

/*
Redirect report by id
*/
router.get('/:id', requiresAuth(), (req, res, next) => {
    res.redirect(`/report/${req.params.id}/backstop_data/html_report/test-index`)
});

/*
Serve static individual report using file location
*/
router.get("/*/backstop_data/html_report/test-index",requiresAuth(), function(req, res, next) {
    const param = req.url.slice(req.url.indexOf('?')+1);
    let folder = req.url.replace('test-index', 'index.html').replace('/', '_').replace(`?${param}`, '');
    if (folder.indexOf('_') === 0) {
        folder = folder.slice(1);
    }
    const fileExists =  fs.existsSync(`snapshots/${folder}`);
    res.render("test-index", {
        title: "Report",
        user: req.oidc.user,
        exists: fileExists,
    });
});

module.exports = router;