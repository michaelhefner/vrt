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
  joinedTables: async () => {
    try {
    return await pool.query(
        `
        SELECT tests.title,
          urls.url, 
          reports.failure, 
          reports.viewport,
          reports.mis_match_percent,
          reports.analysis_time,
          tests.uuid as "test_id", 
          user_group, 
          reports.uuid as "report_id"
        FROM tests 
        JOIN reports on reports.test_uuid = tests.uuid
        JOIN urls on tests.base_url_id = urls.id
        ORDER BY tests.uuid;`
      ).then(res=>res.rows);
    } catch (error) {
      return { message: error.detail, code: error.code, error: error };
    }
  },
  avgMisMatch: async () => {
    try {
    return await pool.query(
        `
        SELECT r.viewport, avg(mis_match_percent)
        FROM tests 
        JOIN (SELECT * FROM reports WHERE failure = TRUE) as r
        ON r.test_uuid = tests.uuid
        JOIN urls on tests.base_url_id = urls.id
        GROUP BY r.viewport 
        ORDER BY avg DESC
        LIMIT 5;
    `
      ).then(res=>res.rows);
    } catch (error) {
      return { message: error.detail, code: error.code, error: error };
    }
  }
};
