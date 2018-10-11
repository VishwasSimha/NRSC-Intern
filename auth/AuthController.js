var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/register', function(req, res) {

  var yes = req.body.password;
  console.log(yes);  
  //var salt = bcrypt.genSaltSync(8);
   var hashedPassword = bcrypt.hashSync(yes, 8);
   console.log(hashedPassword);
    
   //var Password = req.body.password;
    
    /* bcrypt.hash(Password, 10, function(err, hash){
      if(err) {
         return res.status(500).json({
            error: err
         });
      }
      else{*/
    User.create({
      name : req.body.name,
      email : req.body.email,
      password : hashedPassword
    },
    function (err, user) {
      if (err) return res.status(500).send("There was a problem registering the user.")
      // create a token
      const payload = {
        id: user._id,
        name: user.name
      };
      console.log(req.body.name);
      console.log(req.body.email);
      //console.log(hashedpassword);
      
      var token = jwt.sign(payload, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      var data = new User(user);
      data.save();
      res.status(200).redirect('/');
      //res.status(200).send({ auth: true, token: token });
      //res.redirect('/login');
      
    }); 
  });
  //});
//});
  router.get('/me', function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      User.findById(decoded.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        
        res.status(200).send(user);
      });
    });
  });

  router.post('/login', function(req, res) {
    /*User.findOne({ email: req.body.email })
      .exec()
      .then (function (user) {
        bcrypt.compare(req.body.password, user.password, function(err, result){
          if(err) {
            return res.status(401).json({
               failed: 'Unauthorized Access'
            });
         }
         if(result) {
            res.status(200).json(); 
         }
         return res.status(401).json();*/
        User.findOne({email:req.body.email}, function(err,user){
                if (err) return res.status(500).send('Error on the server.');
                if (!user) return res.status(404).send('No user found.');
                var passwordIsValid = bcrypt.compareSync(req.body.password , user.password);
                if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
          
          var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
          });
      
          res.status(200).send({ auth: true, token: token });
        });
        /*.catch(error => {
         res.status(500).json({
         error: error  
        });
       });*/
      });

  
  router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
  });

  module.exports = router;