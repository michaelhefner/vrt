var express = require("express");
var router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const backstop = require("../middleware/backstop/index.js");
const config = require('../default.json');
const fs = require('fs');
const path = require('path');
const dbhandler = require('../middleware/db/handler');
const { v4: uuidv4 } = require('uuid');

const populateTest = async (req) => {
    let baseUrlId = '';
    let testUrlId = '';
    let userGroup = '';
    const title = req.body.id;
    const getuserGroup = async () => {
        return await dbhandler.select.query('users', 'user_group', `WHERE uuid='${req.oidc.user.sub}'`)
            .then(response => { console.log('USER GOUP RESPONSE', response); return response; })
            .then(response => response && response !== undefined && response[0] ? response[0].user_group : -1)
    }
    const getUrlMatch = async (url) => {
        return await dbhandler.select.query('urls', 'id', `WHERE url='${url}'`)
            .then(response => { console.log('SELECT URL RESPONSE', response); return response; })
            .then(response => response && response !== undefined && response[0] ? response[0].id : -1)
    };
    const insertUrl = async (url) => {
        await dbhandler.insert.url(url);
        return getUrlMatch(url);
    };
    const insertTest = async () => {
        dbhandler.insert.test(baseUrlId, testUrlId, title, userGroup);
    }

    userGroup = await getuserGroup();

    baseUrlId = await getUrlMatch(req.body.referenceUrl);
    if (baseUrlId === -1) {
        baseUrlId = await insertUrl(req.body.referenceUrl)
    }

    testUrlId = await getUrlMatch(req.body.testUrl);
    if (testUrlId === -1) {
        testUrlId = await insertUrl(req.body.testUrl)
    }

    if (baseUrlId !== -1 && testUrlId !== -1 && userGroup !== -1) {
        insertTest().then(response => console.log('INSERT TEST RESPONSE', response));
    }

}


router.get("/", function (req, res, next) {
    const user = req.oidc.user;
    if (user !== null && user !== undefined) {
        const userMatch = dbhandler.select.query('users', '*', `WHERE uuid='${user.sub}' and email='${user.email}'`);
        userMatch.then(results => {
            if (results.length === 0) {
                const userGroup = uuidv4();
                dbhandler.insert.user(user.nickname, user.email, user.sub, userGroup).then(response => console.log(response));
            }
        })
        res.render("index", {
            title: "Regression Testing",
            user: req.oidc.user,
        });
    } else {
        res.render('index', { title: 'Visual Regression Testing' });
    }
});

router.get("/run-test", requiresAuth(), function (req, res, next) {
    res.render("run-test", {
        title: "Run Test",
        user: req.oidc.user,
        body: req.body,
        config: config
    });
});
router.get("/run-test/:id", requiresAuth(), function (req, res, next) {
    const editConfig = require(`../snapshots/${req.params.id}/backstop.json`)
    res.render("run-test", {
        title: "Run Test",
        user: req.oidc.user,
        body: req.body,
        config: editConfig
    });
});
router.post("/run-test/test", requiresAuth(), (req, res, next) => {
    backstop.backstopTest(req);
    populateTest(req);
    res.redirect('/view-test');
});
router.post("/run-test/reference", requiresAuth(), (req, res, next) => {
    backstop.backstopReference(req);
    populateTest(req);
    res.redirect('/view-test');
});

router.get("/delete/:id", requiresAuth(), (req, res, next) => {
    const parentDir = req.params.id.indexOf('/') > -1 ? req.params.id.slice(0, req.params.id.indexOf('/')).replace('_', '/') : req.params.id.replace('_', '/').replace('..', '');
    if (fs.existsSync(path.join(__dirname, `../snapshots/${parentDir}`))) {
        fs.rmSync(path.join(__dirname, `../snapshots/${parentDir}`), { recursive: true, force: true });
        res.redirect('/view-test');
    } else {
        next({ message: "sorry this test was not found" });
    }
});

router.get("/view-test", requiresAuth(), (req, res, next) => {
    fs.readdir(path.join(__dirname, '../snapshots'), (err, files) => {
        if (files) {
            const links = files.map((val) => {
                return { href: `report/${val}`, name: val }
            });
            res.render('view-test', {
                title: "View Tests",
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

module.exports = router;