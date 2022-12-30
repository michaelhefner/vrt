var express = require("express");
var router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const backstop = require("../middleware/backstop/index.js");
const config = require('../default.json');
const fs = require('fs');
const path = require('path')


router.get("/", function(req, res, next) {
    res.render("index", {
        title: "Regression Testing",
        user: req.oidc.user,
    });
});
router.get("/run-test", requiresAuth(), function(req, res, next) {
    res.render("run-test",{
        title: "Regression Test Config",
        user: req.oidc.user,
        body: req.body,
        config: config
    });
});
router.get("/run-test/:id", requiresAuth(), function(req, res, next) {
    console.log('request id',req.params.id);
    const editConfig = require(`../snapshots/${req.params.id}/backstop.json`)
    console.log('edit config', editConfig);
    res.render("run-test",{
        title: "Regression Test Config",
        user: req.oidc.user,
        body: req.body,
            config: editConfig
    });
});
router.post("/run-test", requiresAuth(), function(req, res, next) {
    backstop.backstopReference(req);
    res.redirect( '/vrt/view-test');
});

// router.get("/login",  (req, res) => {
//     res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
// });
router.get("/view-test", requiresAuth(), (req, res) => {
    fs.readdir(path.join(__dirname, '../snapshots'), (err, files) =>{
        if (files) {
            const links = files.map((val) => {
                return {href: `report/${val}`, name: val}
            });
            res.render('view-test',{
                title: "Regression Test View",
                user: req.oidc.user,
                body: req.body,
                config: config,
                links: links
            });
        } else {

            res.render('view-test',{
                title: "Regression Test View",
                user: req.oidc.user,
                body: req.body,
                config: config
            });
        }
    })
});

router.get('/report/:id', requiresAuth(), (req, res, next) => {
    res.redirect(`/vrt/report/${req.params.id}/backstop_data/html_report/test-index`)
})

router.get("/report/*/backstop_data/html_report/test-index",requiresAuth(), function(req, res, next) {
    res.render("test-index", {
        title: "Regression Testing",
        user: req.oidc.user,
    });
});
module.exports = router;