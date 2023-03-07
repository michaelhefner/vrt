const { pool } = require("./Connection.js");
/*
Dynamic delete function
*/
class Delete {
    constructor() {
    }

    async row(tableName, whereClause) {
        try {
            if (whereClause.toLowerCase().indexOf('where') > -1) {
                return await pool.query(
                    `DELETE FROM ${tableName} ${whereClause};`
                ).then(res => res.rows);
            } else {
                return { error: 'incorrect where statement' }
            }
        } catch (error) {
            return { message: error.detail, code: error.code, error: error };
        }
    }
}
module.exports = new Delete();