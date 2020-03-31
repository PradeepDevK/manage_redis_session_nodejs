/* jshint node: true */
/* jshint esnext: true */
"use strict";

let config = require('../config/app_config');

class UserLogin {
    constructor(sessionData) {
        var self = this;
        self.sessionData = sessionData;
    }

    validatePassWord(postData, callback) {
        let self = this;
        let sqlQuery = "SELECT * from redis_demo.user_login WHERE user_email=? AND `user_password`=?";
        let inserts = [postData.user_email, postData.user_password];
        global.db.getConnectionExeQuery(sqlQuery, inserts, (err, rows) => {
            if (err) {
                console.log(err);
                return callback(null);
            }
            if (rows.length === 0) {
                return callback(false);
            }
            callback(rows[0]);
        });
    }

    checkEmail(postData, callback) {
        let self = this;
        let sqlQuery = "SELECT * from redis_demo.user_login WHERE user_email=?";
        let inserts = [postData.user_email];
        global.db.getConnectionExeQuery(sqlQuery, inserts, (err, rows) => {
            if (err) {
                console.log(err);
                return callback(null);
            }
            if (rows.length === 0) {
                return callback(false);
            }
            callback(true);
        });
    }

    register(postData, callback) {
        let self = this;
        let sqlQuery = "INSERT into redis_demo.user_login(user_email,user_password,user_name) VALUES (?, ?, ?)";
        let inserts = [postData.user_email, postData.user_password, postData.user_name];
        global.db.getConnectionExeQuery(sqlQuery, inserts, (err, rows) => {
            if (err) {
                console.log(err);
                return callback(null);
            }
            callback(false);
        });
    }

    fetchStatus(postData, callback) {
        let self = this;
        let sqlQuery = "SELECT * FROM redis_demo.user_status WHERE user_id=?";
        let inserts = [self.sessionData.key["user_id"]];
        global.db.getConnectionExeQuery(sqlQuery, inserts, (err, rows) => {
            if (err) {
                console.log(err);
                return callback(null);
            }
            if (rows.length === 0) {
                return callback(false);
            }
            callback(rows);
        });
    }

    addStatus(postData, callback) {
        let self = this;
        let sqlQuery = "INSERT into redis_demo.user_status(user_id,user_status) VALUES (?,?)";
        let inserts = [self.sessionData.key["user_id"] , postData.status];
        global.db.getConnectionExeQuery(sqlQuery, inserts, (err, rows) => {
            if (err) {
                console.log(err);
                return callback(null);
            }
            callback(false);
        });
    }

}

module.exports = UserLogin;