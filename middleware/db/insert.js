const { pool } = require("./connect.js");

module.exports = {
  user: async (username, email, uuid, user_group) => {
    try {
      const date = (new Date).toLocaleString();
      pool
        .query(
          `
          INSERT INTO users (username, email, uuid, user_group, last_updated, created) 
          VALUES ('${username}', '${email}', '${uuid}', '${user_group}', '${date}', '${date}')
          `
        );
    } catch (error) {
      return { message: error.detail, code: error.code, error: error };
    }
  },
  url: async (url) => {
    try {
      const date = (new Date).toLocaleString();
      pool
        .query(
          `
          INSERT INTO urls (url, last_updated, created) 
          VALUES ('${url}', '${date}', '${date}')
          `
        );
    } catch (error) {
      return { message: error.detail, code: error.code, error: error };
    }
  },
  test: async (uuid, baseUrl, testUrl, title, user_group) => {
    try {
      const date = (new Date).toLocaleString();
      console.log(
        `
        INSERT INTO tests (uuid, base_url_id, test_url_id, title, user_group) 
        VALUES ('${uuid}','${baseUrl}', '${testUrl}', '${title}', '${user_group}')
        `);
      pool
        .query(
          `
          INSERT INTO tests (uuid, base_url_id, test_url_id, title, user_group, last_updated, created) 
          VALUES ('${uuid}','${baseUrl}', '${testUrl}', '${title}', '${user_group}', '${date}', '${date}')
          `
        );
    } catch (error) {
      return { message: error.detail, code: error.code, error: error };
    }
  },
};