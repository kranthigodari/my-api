var db = require('../dbconnection');
var myDate = new Date();

var User = {
    getuser: function(email,callback) {
        return 1;
        return db.query("Select * from cnt_users where cnt_email=?",[email],callback);
    },

};

module.exports = User;
