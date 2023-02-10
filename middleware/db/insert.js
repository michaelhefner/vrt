const { pool } = require("./connect.js");

module.exports = {
  user: async (username, email, uuid, user_group) => {
    try {
      pool
        .query(
          `
          INSERT INTO users (username, email, uuid, user_group) 
          VALUES ('${username}', '${email}', '${uuid}', '${user_group}')
          `
        );
    } catch (error) {
      return { message: error.detail, code: error.code, error: error };
    }
  },
  url: async (url) => {
    try {
      pool
        .query(
          `
          INSERT INTO urls (url) 
          VALUES ('${url}')
          `
        );
    } catch (error) {
      return { message: error.detail, code: error.code, error: error };
    }
  },
  test: async (baseUrl, testUrl, title, user_group) => {
    try {
      pool
        .query(
          `
          INSERT INTO tests (base_url_id, test_url_id, title, user_group) 
          VALUES ('${baseUrl}', '${testUrl}', '${title}', '${user_group}')
          `
        );
    } catch (error) {
      return { message: error.detail, code: error.code, error: error };
    }
  },
};