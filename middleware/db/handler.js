const { pool } = require("./connect.js");
const select = require("./select");
const insert = require("./insert");
const update = require("./update");
const qDelete = require("./delete");

const databaseCheck = () => {
  return pool.query(
    `SELECT datname as dbname FROM pg_database where datname = 'VRT' group by datname;`
  );
};

const createDB = (dbname) => {
  return pool // Create DB if it does not exist
    .query(`CREATE DATABASE "${dbname}";`);
};


databaseCheck("VRT").then((res) => {
  if (res.rows.length === 0) {
    createDB("VRT");
  }
});

module.exports = { select, insert, qDelete, update };
