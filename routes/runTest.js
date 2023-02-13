var express = require("express");
var router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const backstop = require("../middleware/backstop/index.js");
const config = require('../default.json');
const dbhandler = require('../middleware/db/handler');
const { v4: uuidv4 } = require('uuid');

/*
Function to save test information to the database
*/
const populateTest = async (req) => {
    let baseUrlId = '';
    let testUrlId = '';
    let userGroup = '';
    let uuid = '';
    const title = req.body.id;
    const getuserGroup = async () => {
        return await dbhandler.select.query('users', 'user_group', `WHERE uuid='${req.oidc.user.sub}'`)
            .then(response => { console.log('USER GOUP RESPONSE', response); return response; })
            .then(response => response && response !== undefined && response[0] ? response[0].user_group : -1)
    }
    const getUrlMatch = async (url) => {
        return await dbhandler.select.query('urls', 'id', `WHERE url = '${url}'`)
            .then(response => { console.log('SELECT URL RESPONSE', response); return response; })
            .then(response => response && response !== undefined && response[0] ? response[0].id : -1)
    };
    const insertUrl = async (url) => {
        await dbhandler.insert.url(url);
        return getUrlMatch(url);
    };
    const insertTest = async () => {
        const testMatch = await dbhandler.select.query('tests', '*', `WHERE user_group='${userGroup}' and test_url_id=${testUrlId}`);
        if (testMatch.length > 0) {
            uuid = testMatch[0].uuid;
            await dbhandler.update.test(uuid, baseUrlId, testUrlId, title, userGroup);
        } else {
            uuid = uuidv4();
            await dbhandler.insert.test(uuid, baseUrlId, testUrlId, title, userGroup);
        }
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
        await insertTest().then(response => console.log('INSERT TEST RESPONSE', response))
        .catch(error=>console.log('ERROR', error));
    }
    return uuid;
}

router.get("/", requiresAuth(), function (req, res, next) {
    // console.log('********************************* CONFIG ******************************', config);
    res.render("run-test", {
        title: "New Test",
        active: 'New Test',
        user: req.oidc.user,
        body: req.body,
        config: config
    });
});

router.get("/:id", requiresAuth(), function (req, res, next) {
    const editConfig = require(`../snapshots/${req.params.id}/backstop.json`)
    res.render("run-test", {
        title: "New Test",
        active: 'New Test',
        user: req.oidc.user,
        body: req.body,
        config: editConfig
    });
});

router.post("/test", requiresAuth(), (req, res, next) => {
    populateTest(req).then(uuid=>backstop.backstopTest(req, uuid));
    res.redirect('/view-test');
});

router.post("/reference", requiresAuth(), (req, res, next) => {
    populateTest(req).then(uuid=>backstop.backstopReference(req, uuid));
    res.redirect('/view-test');
});

module.exports = router;