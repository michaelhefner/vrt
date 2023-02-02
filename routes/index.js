var express = require("express");
var router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const backstop = require("../middleware/backstop/index.js");
const config = require('../default.json');
const fs = require('fs');
const path = require('path')


router.get("/", function(req, res, next) {
    // fs.mkdir(path.join(__dirname, '../snapshots'),(res)=>console.log(res));
    // fs.writeFileSync(path.join(__dirname, '../snapshots/default.json'), JSON.stringify(config, null, 2));
    res.render("index", {
        title: "Regression Testing",
        user: req.oidc.user,
    });
});
router.get("/home", function(req, res, next) {
    res.render("home", {
        title: "Regression Testing",
        user: req.oidc.user,
    });
});
router.get("/run-test", requiresAuth(), function(req, res, next) {
    res.render("run-test",{
        title: "Run Test",
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
        title: "Run Test",
        user: req.oidc.user,
        body: req.body,
            config: editConfig
    });
});
router.post("/run-test", requiresAuth(), function(req, res, next) {
    backstop.backstopReference(req, res);
    res.redirect( '/view-test');
    // res.json({message: 'success'})

});

router.get("/delete/:id", requiresAuth(), (req, res, next) => {
    const parentDir = req.params.id.indexOf('/') > -1 ? req.params.id.slice(0, req.params.id.indexOf('/')).replace('_', '/') : req.params.id.replace('_', '/').replace('..', '');
    if (fs.existsSync(path.join(__dirname, `../snapshots/${parentDir}`))) {
        fs.rmSync(path.join(__dirname, `../snapshots/${parentDir}`), { recursive: true, force: true });
        res.redirect('/view-test');
    } else {
        next({message: "sorry this test was not found"});
    }
});
router.get("/view-test", requiresAuth(), (req, res, next) => {
    fs.readdir(path.join(__dirname, '../snapshots'), (err, files) =>{
        if (files) {
            const links = files.map((val) => {
                return {href: `report/${val}`, name: val}
            });
            res.render('view-test',{
                title: "View Tests",
                user: req.oidc.user,
                body: req.body,
                config: config,
                links: links
            });
        } else {

            res.render('view-test',{
                title: "View Tests",
                user: req.oidc.user,
                body: req.body,
                config: config
            });
        }
    })
});

router.get('/report/:id', requiresAuth(), (req, res, next) => {
    res.redirect(`/report/${req.params.id}/backstop_data/html_report/test-index`)
})

router.get("/report/*/backstop_data/html_report/test-index",requiresAuth(), function(req, res, next) {
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