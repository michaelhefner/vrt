const { pool } = require("./connect.js");

module.exports = async (tableName, whereClause) => {
    try {
        console.log(`*************** DELETE FROM ${tableName} ${whereClause};`);
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
};
