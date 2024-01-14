require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
var mysql = require ('mysql');
const app = express();

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

