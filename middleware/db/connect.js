const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.db_username,
    database: process.env.db_name,
    password: process.env.db_pw,
    port: process.env.db_port,
    host: process.env.db_host,
  });
    pool.query(
      `
      CREATE TABLE IF NOT EXISTS
        Users (id serial primary key,
          username varchar(255) NOT NULL, 
          email varchar(255) NOT NULL, 
          uuid varchar(255) NOT NULL,
          user_group varchar(255) NOT NULL,
          last_updated timestamp,
          created timestamp,
          unique(username, email, uuid)
          );
      CREATE TABLE IF NOT EXISTS
        URLS (id serial primary key,
          url varchar(255) NOT NULL,
          created timestamp,
          unique(url)
          );
      CREATE TABLE IF NOT EXISTS
        Tests (
          uuid varchar(64) primary key,
          base_url_id integer NOT NULL, 
          test_url_id integer NOT NULL, 
          title varchar(255) NOT NULL, 
          user_group varchar(255) NOT NULL,
          last_updated timestamp,
          created timestamp,
          CONSTRAINT fk_base_url_id
            FOREIGN KEY(base_url_id) 
	            REFERENCES urls(id),
              CONSTRAINT fk_test_url_id
                FOREIGN KEY(test_url_id) 
                  REFERENCES urls(id)
          );
          `
    );
    /*

    TODO: Need to create a new table for test results, pass and error
    */
module.exports = { pool };