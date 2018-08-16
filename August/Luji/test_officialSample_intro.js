var mysql = require("mysql");

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'huanhuan0921',
    port : '3306',
    database : 'luji'
});

connection.connect(function (err) {
    if(err){
        console.log('[query]- :'+err);
        return;
    }
    console.log('[connection connect] succeed!');
});

connection.end(function(err){
    if(err){
        return;
    }
    console.log('[connection end] succeed!');
});