var express = require("express");
var router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const config = require('../default.json');
const fs = require('fs');
const path = require('path');

router.get("/reports/:id", requiresAuth(), (req, res, next) => {
    fs.readdir(path.join(__dirname, `../snapshots/${req.params.id}/backstop_data/bitmaps_test`), (err, files) => {
        if (files) {
            const links = files.map((val) => {
                return { href: `/view-tests/reports/${req.params.id}/${val}`, name: val, datetime: new Date(val.slice(0, 4), val.slice(4, 6), val.slice(6,8), val.slice(9,11), val.slice(11, 13), val.slice(13, 15)) }
            });
            res.render('view-reports', {
                title: "View Tests",
                active: 'View Tests',
                user: req.oidc.user,
                body: req.body,
                config: config,
                links: links
            });
        } else {

            res.render('view-test', {
                title: "View Tests",
                user: req.oidc.user,
                body: req.body,
                config: config
            });
        }
    })
});

router.get("/reports/:id/:report", requiresAuth(), (req, res, next) => {
    let baseUrl = req.originalUrl;
    baseUrl = baseUrl.replace('/view-tests/reports', '/report').replace(req.params.report, `backstop_data/${req.params.report}`);

    fs.readFile(path.join(__dirname, `../snapshots/${req.params.id}/backstop_data/bitmaps_test/${req.params.report}/report.json`), (err, files) => {
        const report = JSON.parse(files.toString());
        const failures = report.tests.map(test => {
            if (test.status === 'fail') {
                return test;
            }
        });
        res.render('print-report', { user: req.oidc.user, originalUrl: baseUrl, data: report });
    });
});
module.exports = router;
