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
          last_updated timestamp NOT NULL,
          created timestamp NOT NULL,
          unique(username, email, uuid)
          );
      CREATE TABLE IF NOT EXISTS
        URLS (id serial primary key,
          url varchar(255) NOT NULL,
          created timestamp NOT NULL,
          unique(url)
          );
      CREATE TABLE IF NOT EXISTS
        Tests (
          uuid varchar(64) primary key,
          base_url_id integer NOT NULL, 
          test_url_id integer NOT NULL, 
          title varchar(255) NOT NULL, 
          user_group varchar(255) NOT NULL,
          last_updated timestamp NOT NULL,
          created timestamp NOT NULL,
          CONSTRAINT fk_base_url_id
            FOREIGN KEY(base_url_id) 
	            REFERENCES urls(id),
          CONSTRAINT fk_test_url_id
            FOREIGN KEY(test_url_id) 
              REFERENCES urls(id)
          );
      
      CREATE TABLE IF NOT EXISTS
        reports (
          id serial primary key,
          uuid varchar(64),
          failure boolean,
          test_uuid varchar(64) NOT NULL,
          last_updated timestamp NOT NULL,
          created timestamp NOT NULL,
          CONSTRAINT fk_test
            FOREIGN KEY(test_uuid) 
	            REFERENCES tests(uuid)
        );
          `
);
module.exports = { pool };