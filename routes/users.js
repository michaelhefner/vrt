var express = require('express');
const { requiresAuth } = require('express-openid-connect');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/profile", requiresAuth(), (req, res, next) => {
  console.log(req.oidc.user);
  res.render("profile", { title: "User", user: req.oidc.user });
});

module.exports = router;
