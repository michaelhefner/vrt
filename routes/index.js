var express = require("express");
var router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const config = require('../default.json');
const fs = require('fs');
const path = require('path');
const dbhandler = require('../middleware/db/handler');
const { v4: uuidv4 } = require('uuid');

/*
Home route get current user, if the user is a first time login then add them to the database
*/
router.get("/", function (req, res, next) {
    const user = req.oidc.user;
    if (user !== null && user !== undefined) {
        const userMatch = dbhandler.select
            .query('users', '*', `WHERE uuid='${user.sub}' and email='${user.email}'`);
        userMatch.then(results => {
            if (results.length === 0) {
                const userGroup = uuidv4();
                dbhandler.insert
                    .user(user.nickname, user.email, user.sub, userGroup)
                    .then(response => console.log(response));
            }
        });
        
        res.render("index", {
            title: "Regression Testing",
            active: 'Home',
            user: req.oidc.user
        });
    } else {
        res.render('index', { title: 'Visual Regression Testing' });
    }

});

/*
Route for test list 
*/
router.get("/view-test", requiresAuth(), (req, res, next) => {
    fs.readdir(path.join(__dirname, '../snapshots'), (err, files) => {
        if (files) {
            const getLinks = async () => {
                const links = [];
                for (let val of files) {
                    const testReady = fs.existsSync(path.join(__dirname, `../snapshots/${val}/backstop_data/html_report`));
                    const referenceReady = fs.existsSync(path.join(__dirname, `../snapshots/${val}/backstop_data/bitmaps_reference`));
                    await dbhandler.select.query('tests', '*', `WHERE uuid ='${val}'`).then(test => {
                        console.log(test[0]);
                        links.push( {
                            href: `report/${val}`,
                            name: test[0].title,
                            allTests: `view-tests/reports/${val}`,
                            testReady: testReady,
                            test: test[0],
                            referenceReady: referenceReady
                        });
                    })
                };
                return links;
            }
            getLinks().then(links => {
                console.log('links', links);
                req.session.cookie.config = config;
                res.render('view-test', {
                    title: "View Tests",
                    active: 'View Tests',
                    user: req.oidc.user,
                    body: req.body,
                    config: config,
                    links: links
                });

            });
        } else {
            res.render('view-test', {
                title: "View Tests",
                active: 'View Tests',
                user: req.oidc.user,
                body: req.body,
                config: config
            });
        }
    })
});


/*
Redirect report from id
*/
router.get('/report/:id', requiresAuth(), (req, res, next) => {
    res.redirect(`/report/${req.params.id}/backstop_data/html_report/test-index`)
})

/*
Grab static files to display the test
*/
router.get("/report/*/backstop_data/html_report/test-index", requiresAuth(), function (req, res, next) {
    const param = req.url.slice(req.url.indexOf('?') + 1);
    const folder = req.url.replace('/report', 'snapshots').replace('test-index', 'index.html').replace(`?${param}`, '');
    const fileExists = fs.existsSync(`${folder}`);
    res.render("test-index", {
        title: "Report",
        user: req.oidc.user,
        exists: fileExists,
    });
});

/*
Call the average mis match function and return the results
*/
router.post("/report/get-avg-mismatch", (req, res, next) => {
    const getDataView = async () => {
        return await dbhandler.select.avgMisMatch();
    }
    getDataView().then(result=> {
        console.log(result);
        res.json(result);
    });
});

/*
Call the average analysis time function and return the results
*/
router.post("/report/get-avg-analysis", (req, res, next) => {
    const getDataView = async () => {
        return await dbhandler.select.avgAnalysisTime();
    }
    getDataView().then(result=> {
        console.log(result);
        res.json(result);
    });
});

module.exports = router;