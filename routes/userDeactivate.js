var express = require('express'),
jwt     = require('express-jwt'),
config  = require('../config'),
db      = require('../dbconnection');
var app = module.exports = express.Router();
var jwtCheck = jwt({
secret: config.secretKey
});
function getUserDB(email, done) {
    db.query('Select * from cnt_users where cnt_email = ?', [email], function(err, rows, fields) {
    if (err) throw err;
    done(rows[0]);
});
}
function getAllUsers(done) {
    db.query('Select * from cnt_users where cnt_status=1',function(err, rows, fields) {
        if(err) throw err;
        done(rows);
    })
}

app.use('/findfriends', jwtCheck);
app.post('/findfriends/users', function(req, res) {
    db.query("Select * from cnt_users where cnt_status=1 AND cnt_u_id !="+req.body.cnt_u_id,function(err, rows, fields) {
        if(err) throw err;
        res.status(200).send(rows);
});
});
app.post('/findfriends/viewUser', function(req, res) {
    db.query("Select * from cnt_users where cnt_status=1 AND cnt_u_id ="+req.body.id,function(err, rows, fields) {
        if(err) throw err;
        res.status(200).send(rows);
});
});
app.use('/deactivate', jwtCheck);
app.post('/deactivate/user', function(req, res) {
    if(!req.body.email || !req.body.password) {
    return res.status(401).send({message: "Please make sure that you send credentials"});
    } 
    getUserDB(req.body.email, function(user){
    if (!user) {
        return res.status(401).send({
        message:"Please enter a valid Email Id"
        });
    }
    if (user.cnt_password !== req.body.password) {
        return res.status(401).send({
        message: "Email and Password didn't match"
        });
    }
    db.query("UPDATE cnt_users SET cnt_status=0 where cnt_email= '"+req.body.email+"'",function(err, result) {
        if(err) throw err;
        return res.status(200).send({
            result,
            message: "You have successfully deactivated your account."
            });
      });
    });
});