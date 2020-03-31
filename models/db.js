/* jshint node: true */
/* jshint esnext: true */
"use strict";

const fs = require('fs');

/**
 * Defines database operations.
 * @class DatabaseOperations
 */

class DatabaseOperations {

    /**
     * @constructor
     **/

    constructor() {
        this.host = "localhost";
        this.user = "root";
        this.password = "root";
        this.database = "redis_demo";
        this.connectionLimit = 20;
        this.credentials = null;
    }

    /**
     * Creates and returns the SQL connection pool object.
     **/

    createPool() {
        let self = this;
        let sslOptions = false;
        return global.mysql.createPool({
            host: self.host,
            user: self.user,
            password: self.password,
            ssl: sslOptions,
            connectionLimit: self.connectionLimit,
            multipleStatements: true
        });
    }

    /**
     * Establishes SQL connection from the pool and returns the connection object.
     * @param {Object} pool SQL connection pool object.
     * @param {cb} callback The callback that handles the response.
     **/

    getPoolConnection(pool, callback) {
        var self = this;
        if (pool === undefined || pool === null) {
            pool = self.createPool();
        }
        pool.getConnection(function (err, connection) {
            if (err) {
                //logging here
                global.logger.error(self.uuid, "Error getting connection from pool", "Error=" + JSON.stringify(err), "Stacktrace=" + err.stack);
                callback(err, null);
                return;
            }
            if (global.connectionThreadId[connection.threadId] === undefined) {
                global.connectionThreadId[connection.threadId] = "0";
                connection.on('error', function (err) {
                    if (err.code === "PROTOCOL_CONNECTION_LOST") {
                        connection.destroy();
                    } else {
                        connection.release();
                        global.logger.error(err);
                    }
                    return;
                });
            }
            callback(null, connection);
        });
    }

    /**
     * Establishes SQL connection from the pool and returns the connection object.
     * @param {Object} pool SQL connection pool object.
     * @param {cb} callback The callback that handles the response.
     **/

    getConnection(pool, callback) {
        var self = this;
        if (pool === undefined || pool === null) {
            pool = self.createPool();
        }
        pool.getConnection(function (err, connection) {
            if (err) {
                //logging here
                global.logger.error(self.uuid, "Error getting connection from pool", "Error=" + JSON.stringify(err), "Stacktrace=" + err.stack);
                callback(err, null);
                return;
            }
            if (global.connectionThreadId[connection.threadId] === undefined) {
                global.connectionThreadId[connection.threadId] = "0";
                connection.on('error', function (err) {
                    if (err.code === "PROTOCOL_CONNECTION_LOST") {
                        connection.destroy();
                    } else {
                        connection.release();
                        global.logger.error(err);
                    }
                    return;
                });
            }
            callback(null, connection);
        });
    }


    /**
     * Establishes mysql connection, begins transaction and returns the transactio connection object.
     * @param {object} pool - Mysql pool object.
     * @param {function} callback - Callback.
     */

    createTransaction(pool, callback) {
        var self = this;
        self.getPoolConnection(pool, function (err, connection) {
            if (err) {
                //logging here
                global.logger.error(self.uuid, "Error getting connection from pool", "Error=" + JSON.stringify(err), "Stacktrace=" + err.stack);
                return;
            }
            connection.beginTransaction(function (err) {
                if (err) {
                    global.logger.error(self.uuid, "Error creating transaction connection", "Error=" + JSON.stringify(err), "Stacktrace=" + err.stack);
                    callback(true);
                    return;
                }
                callback(null, connection);
            });
        });
    }

    getConnectionExeQuery(query, inserts, callback) {
        var self = this;
        self.getPoolConnection(global.mysqlPool, function (err, connection) {
            if (err) {
                return callback(err);
            }
            var formatedQuery = connection.query(query, inserts, function (err, rows) {
                connection.release();
                if (err) {
                    //global.logger.error(self.uuid, "Query execution failed", "Query=" + formatedQuery.sql, "Error=" + JSON.stringify(err), "Stacktrace=" + err.stack);
                    return callback(err);
                }
                return callback(null, rows);
            });
        });
    }

}
module.exports = new DatabaseOperations();