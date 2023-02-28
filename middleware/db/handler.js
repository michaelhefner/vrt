const select = require("./Select");
const insert = require("./Insert");
const update = require("./Update");
const qDelete = require("./Delete");

/*
Creating a handler service for easy access to CRUD operations to the database.
*/
module.exports = { select, insert, qDelete, update };