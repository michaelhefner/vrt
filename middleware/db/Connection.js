const { Pool } = require("pg");

const user = process.env.db_username;
const database = process.env.db_name;
const password =  process.env.db_pw;
const port = process.env.db_port;
const host = process.env.db_host;

/*
Initial connection to the database. Use environment variables for connection
*/
class Connection extends Pool {
    constructor(user, database, password, port, host) {
        super({
            user: user,
            database: database,
            password: password,
            port: port,
            host: host,
        });
        this.createBaseTables();
    }

    createBaseTables() {
        /*
        Create needed tables in case tables don't exist
        */
        this.query(
            `
        CREATE TABLE IF NOT EXISTS
          users (
            id serial primary key,
            username varchar(255) NOT NULL, 
            email varchar(255) NOT NULL, 
            uuid varchar(255) NOT NULL,
            user_group varchar(255) NOT NULL,
            last_updated timestamp NOT NULL,
            created timestamp NOT NULL,
            unique(username, email, uuid)
            );
        CREATE TABLE IF NOT EXISTS
          urls (
            id serial primary key,
            url varchar(255) NOT NULL,
            created timestamp NOT NULL,
            unique(url)
            );
        CREATE TABLE IF NOT EXISTS
          tests (
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
            title varchar(64),
            mis_match_percent decimal (4, 2),
            viewport varchar(64),
            analysis_time integer,
            test_uuid varchar(64) NOT NULL,
            last_updated timestamp NOT NULL,
            created timestamp NOT NULL,
            CONSTRAINT fk_test
              FOREIGN KEY(test_uuid) 
                  REFERENCES tests(uuid)
          );
            `
        );
    }
}
module.exports.pool = new Connection(user, database, password, port, host);