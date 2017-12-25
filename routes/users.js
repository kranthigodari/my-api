var express = require('express'),
    _       = require('lodash'),
    config  = require('../config'),
    jwt     = require('jsonwebtoken'),
    db      = require('../dbconnection');
    
    var User=require('../models/User');
    
var router = express.Router();
var secretKey = "don't share this key";
var myDate = new Date();
function createToken(user) {
  return jwt.sign(_.omit(user, 'password'), config.secretKey, { expiresIn: 60*60*5 });
}

function getUserDB(email, done) {
  db.query('Select * from cnt_users where cnt_email = ?', [email], function(err, rows, fields) {
  if (err) throw err;
  done(rows[0]);
  });
  }
router.post('/user/signup', function(req, res) {
  // console.log(req.body);
  if(!req.body.email || !req.body.password) {
    return res.status(400).send({message :"You must send username and password"});
  }
  getUserDB(req.body.email, function(user) {
    // console.log(user);
    if(!user) {
      user = {
        cnt_fname         : req.body.fname,
        cnt_lname         : req.body.lname,
        cnt_email         : req.body.email,
        cnt_password      : req.body.password,
        cnt_mobile        : req.body.mobile,
        cnt_gender        : req.body.gender,
        cnt_created_at    : myDate,
        cnt_updated_at    : myDate,
        cnt_status        : 1,
        cnt_username      : req.body.fname + " " + req.body.lname,
      };
      db.query('INSERT INTO cnt_users SET ?', [user], function(err, result) {
        if(err) throw err;
        newUser = {
          cnt_u_id        : result.insertId,
          cnt_fname       : user.cnt_fname,
          cnt_lname       : user.cnt_lname,
          cnt_email       : user.cnt_email,
          cnt_password    : user.cnt_password,
          cnt_mobile      : user.cnt_mobile,
          cnt_gender      : user.cnt_gender,
          cnt_created_at  : user.cnt_created_at,
          cnt_updated_at  : user.cnt_updated_at,
          cnt_status      : user.cnt_status,
          cnt_username    : user.cnt_username
        };
        res.status(201).send({
          id_token: createToken(newUser)
        });
      });
    }
    else  res.status(400).send({message : "A user with that username already exists"});
  });
});

router.post('/user/login', function(req, res) {
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
    res.status(201).send({
      id_token: createToken(user),
      user: user
    });
    });
});




module.exports=router;