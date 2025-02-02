const { pool } = require("./Connection.js");

class Update {
  constructor(){}
  /*
  Build out update statement
  */
  async user(username, email, uuid, user_group) {
    try {
      return await pool
        .query(
          `
          UPDATE users 
          SET username = '${username}', email = '${email}', 
          user_group = '${user_group}' 
          WHERE uuid = '${uuid}'
          `
        );
    } catch (error) {
      return { message: error.detail, code: error.code, error: error };
    }
  }
  /*
  Build out update statement
  */
  async test(uuid, baseUrl, testUrl, title, user_group) {
    try {
      return await pool
        .query(
            `
            UPDATE tests 
            SET base_url_id = '${baseUrl}', test_url_id = '${testUrl}', 
            title = '${title}', user_group = '${user_group}', 
            last_updated = '${(new Date).toLocaleString()}' 
            WHERE uuid = '${uuid}' 

            `
        );
    } catch (error) {
      return { message: error.detail, code: error.code, error: error };
    }
  }
};

module.exports = new Update();