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

router.post("/add", (req, res, next) => {
  insert.user(req.body.username, req.body.email);
  return res.send(select.user(req.body.username));
});
module.exports = router;
