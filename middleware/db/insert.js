const { pool } = require("./connect.js");

module.exports = {
  
  /*
  Build out insert statement
  */
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
  
  /*
  Build out insert statement
  */
  url: async (url) => {
    try {
      const date = (new Date).toLocaleString();
      pool
        .query(
          `
          INSERT INTO urls (url, created) 
          VALUES ('${url}', '${date}')
          `
        );
    } catch (error) {
      return { message: error.detail, code: error.code, error: error };
    }
  },
  
  /*
  Build out insert statement
  */
  test: async (uuid, baseUrl, testUrl, title, user_group) => {
    try {
      const date = (new Date).toLocaleString();
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
  /*
  Build out insert statement
  */
  report: async (uuid, failure, title, mis_match_percent, viewport, analysis_time, test_uuid) => {
    try {
      const date = (new Date).toLocaleString();
      pool
        .query(
          `
          INSERT INTO reports (uuid, failure, title, mis_match_percent, viewport, analysis_time, test_uuid, last_updated, created) 
          VALUES ('${uuid}',
          '${failure}',
          '${title}',
          ${mis_match_percent},
          '${viewport}',
          '${analysis_time || 0}', 
          '${test_uuid}', 
          '${date}', 
          '${date}')
          `
        );
    } catch (error) {
      return { message: error.detail, code: error.code, error: error };
    }
  },
};