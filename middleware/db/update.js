const { pool } = require("./connect.js");

module.exports = {
  user: async (username, email, uuid, user_group) => {
    try {
      pool
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
  },
  
  test: async (uuid, baseUrl, testUrl, title, user_group) => {
    try {
        
      console.log(
        `
        UPDATE tests WHERE uuid = '${uuid}' 
        SET base_url_id = '${baseUrl}', test_url_id = '${testUrl}', 
        title = '${title}', user_group = '${user_group}', 
        last_updated = '${(new Date).toLocaleString()}'
        `
        );
      pool
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
  },
};