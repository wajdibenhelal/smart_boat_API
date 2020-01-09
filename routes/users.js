var express = require('express');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

var router = express.Router();
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.json({user: 'True'});
});


router.get('/login/:mail/:passwordd', (req, res) => {
    var bool
    console.log("Trying to login with EMAIL:" + req.params.mail + " PASSWORD:" + req.params.passwordd);
    const queryString = "SELECT * FROM users WHERE email = ?";
    const userMail = req.params.mail;
    getConnection().query(queryString, [userMail], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for users with email : " + err);
            res.sendStatus(500);
            return
        }
        console.log("User fetched successfully");
        rows.map((row) => {
            let password = bcrypt.hashSync(req.body.passwordd, bcrypt.genSaltSync(10));
            console.log(row.password);
            console.log(password);
            if (bcrypt.compareSync(row.password, password)) {
                res.json(rows[0]);
            } else {
                res.json({user: 'login'});
            }
        });
    });
});

router.get('/Users', function (req, res, next) {
    const queryString = "SELECT * FROM users";
    getConnection().query(queryString, req.params.id, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for users: " + err);
            res.sendStatus(500);
            return;
        }
        console.log("Users fetched successfully");
        rows.map((row) => {
            res.json(rows[0]);
        });
    });
});

router.post('/register', (req, res) => {
    let password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    console.log(password);
});

var pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'smartboat',
    port: '8889',
    connectionLimit: 10
});


function getConnection() {
    return pool;
}

module.exports = router;
