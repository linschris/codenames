const http = require('http');
const fs = require('fs');
const port = 3000;
const hostname = '127.0.0.1';
var path = require('path');
var express = require('express');
var app = express();
var mysql = require('mysql');


app.get('/signup', function(req, res) {
    res.send("Something")
})




const server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    fs.readFile('index.html', function(error, data) {
        if(error) {
            res.write(404)
            res.write('Error: File Not Found')
        } else {
            res.write(data)
        }
        res.end()
    })
})

server.listen(port, hostname, function(error) {
    if(error) {
        console.log("Could not listen", error)
    } else {
        console.log("Server can listen on port: " + port + " and hostname: " + hostname)
    }
})