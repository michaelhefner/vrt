const { pool } = require("./connect.js");

module.exports = {
  query: async (tableName, columns, whereClause) => {
    try {
      console.log(`*************** SELECT ${columns} FROM ${tableName} ${whereClause};`);
    return await pool.query(
        `SELECT ${columns} FROM ${tableName} ${whereClause};`
      ).then(res=>res.rows);
    } catch (error) {
      return { message: error.detail, code: error.code, error: error };
    }
  },
};
