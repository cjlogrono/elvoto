// server.js

// init project
var express = require('express');
var app = express();
var mongodb = require('mongodb');
var cookieParser = require('cookie-parser');
var assert = require('assert');
var bodyParser = require('body-parser');
var fs = require('fs');
var pug = require('pug');

app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cookieParser());

var MongoClient = mongodb.MongoClient;

var uri = 'mongodb://cjlogrono:Carlos12@ds137686.mlab.com:37686/freecodecamp';

app.get("/", function (req, res) {
  
  if(req.cookies.user)
    res.render("index2");
  else
    res.render('index');
});

app.get('/user/:userId', function(req, res){

  MongoClient.connect(uri, function (err, db) {
        
    assert.equal(null, err);
    db.collection('pollUsers').find({"user":req.params.userId}, {_id:0}).toArray(function(err, doc) {
            
        assert.equal(null, err);  
        db.close();
        if(doc.length == 1)
          res.cookie('user', req.params.userId);
        res.redirect('/');      
    });
  });
});

app.get('/createPoll', function(req, res){

  if(req.cookies.user)
    res.render("createPoll");
  else
    res.render("signIn");
});

app.get('/signIn', function(req, res){

  res.render("signIn");
});

app.get('/signUp', function(req, res){

  res.render("signUp");
});

app.get('/signOut',function(req, res){

  res.clearCookie("user");
  res.redirect('/');
});

app.post('/signInUser', function(req, res){
  
  MongoClient.connect(uri, function (err, db) {
        
    assert.equal(null, err);
    db.collection('pollUsers').find({"user":req.body.username, "password":req.body.password}, {_id:0}).toArray(function(err, doc) {
            
        assert.equal(null, err);  
        db.close();
        if(doc.length == 1){
          res.cookie('user', req.body.username); 
          if(req.header('Referer').split('/')[3] == "createPoll")
            res.send({redirect: '/createPoll'});
          else
            res.send({redirect: '/'});
        }else
          res.send('bad');
    });
  });
});

app.post('/signUpUser', function(req, res){
  
  MongoClient.connect(uri, function (err, db) {
    assert.equal(null, err);
    db.collection('pollUsers').find({"email":req.body.email}, {_id:0}).toArray(function(err, doc) {
        assert.equal(null, err);  
        db.close();
        if(doc.length == 1){
          res.send('email');
        }else{
          MongoClient.connect(uri, function (err, db) {
            db.collection('pollUsers').find({"user":req.body.username}, {_id:0}).toArray(function(err, doc) {
              assert.equal(null, err);  
              db.close();
              if(doc.length == 1){
                res.send('username');
              }else{
                MongoClient.connect(uri, function (err, db) {
                  db.collection('pollUsers').insert({"user":req.body.username, "email": req.body.email, "password":req.body.password}, function(err, results) {
                    assert.equal(null, err);  
                    db.close();
                    res.send('added');
                  });
                });
              }
            });
          });
        } 
   });
  });
});

app.post('/submitPoll', function(req, res){
  
  MongoClient.connect(uri, function (err, db) {
    assert.equal(null, err);
    MongoClient.connect(uri, function (err, db) {
      db.collection('polls').insert({"poll":req.body.poll, "one": req.body.valueOne, "oneVotes":0, "two":req.body.valueTwo, "twoVotes":0, "three":req.body.valueThree, "threeVotes":0, "four": req.body.valueFour, "fourVotes":0, "author": req.cookies.user, "time": new Date().getTime(), "voters": []}, function(err, results) {
        assert.equal(null, err);  
        db.close();
        res.send('added');
      });
    });
  });
});

app.post('/getTopPolls', function(req, res){

  MongoClient.connect(uri, function (err, db) {
        
    assert.equal(null, err);
    db.collection('polls').find({}, {_id:0, author: 0, time: 0, oneVotes: 0, twoVotes:0, threeVotes: 0, fourVotes: 0, totalVotes: 0, voters: 0}).sort( {totalVotes: -1 } ).toArray(function(err, polls) {
            
        assert.equal(null, err);  
        db.close();
        res.send(polls);
    });
  });
});

app.post('/getRecentPolls', function(req, res){

  MongoClient.connect(uri, function (err, db) {
        
    assert.equal(null, err);
    db.collection('polls').find({}, {_id:0, author: 0, oneVotes: 0, twoVotes:0, threeVotes: 0, fourVotes: 0, totalVotes: 0, voters: 0}).sort( {time: -1 } ).toArray(function(err, polls) {
            
        assert.equal(null, err);  
        db.close();
        res.send(polls);
    });
  });
});

app.post('/getUserPolls', function(req, res){

  MongoClient.connect(uri, function (err, db) {
        
    assert.equal(null, err);
    db.collection('polls').find({author: req.cookies.user}, {_id:0, author: 0, oneVotes: 0, twoVotes:0, threeVotes: 0, fourVotes: 0, totalVotes: 0, voters: 0}).sort( {time: -1 } ).toArray(function(err, polls) {
            
        assert.equal(null, err);  
        db.close();
        res.send(polls);
    });
  });
});

app.post('/getSearchPolls', function(req, res){

  MongoClient.connect(uri, function (err, db) {
        
    assert.equal(null, err);
    db.collection('polls').find({poll: {$regex : ".*"+ req.body.key+".*", $options:"i"}}, {_id:0, author: 0, oneVotes: 0, twoVotes:0, threeVotes: 0, fourVotes: 0, totalVotes: 0, voters:0}).sort( {totalVotes: -1} ).toArray(function(err, polls) {
            
        assert.equal(null, err);  
        db.close();
        res.send(polls);
    });
  });
});

app.get('/poll/:question', function(req, res){

  MongoClient.connect(uri, function (err, db) {
        
    assert.equal(null, err);
    var question = req.params.question;
    db.collection('polls').find({poll: question}, {_id:0}).toArray(function(err, poll) {
        
        assert.equal(null, err);  
        db.close();
      
        if(req.cookies.user && req.cookies.user != poll[0].author && poll[0].voters.indexOf(req.cookies.user) == -1){
        
          res.render('pollU',{
            poll: poll[0].poll+"?",
            valueOne: poll[0].one,
            valueTwo: poll[0].two,
            valueThree: poll[0].three,
            valueFour: poll[0].four
          })
        }
      
        else{
          
          console.log(poll[0]);
          var totalVotes = poll[0].oneVotes + poll[0].twoVotes + poll[0].threeVotes + poll[0].fourVotes; 
          var oneP = (poll[0].oneVotes / totalVotes * 100);
          var oneM = 0;
          var twoP = (poll[0].twoVotes / totalVotes * 100);
          var twoM = oneP + oneM;
          var threeP = (poll[0].threeVotes / totalVotes * 100);
          var threeM = twoP + twoM;
          var fourP = (poll[0].fourVotes / totalVotes * 100);
          var fourM = threeP+threeM;
          
        
          if(req.cookies.user){
            res.render('pollR',{
              poll: poll[0].poll+"?",
              valueOne: poll[0].one,
              onePercent: oneP.toFixed(1),
              oneMargin: oneM,
              valueTwo: poll[0].two,
              twoPercent: twoP.toFixed(1),
              twoMargin: twoM,
              valueThree: poll[0].three,
              threePercent: threeP.toFixed(1),
              threeMargin: threeM,
              valueFour: poll[0].four,
              fourPercent: fourP.toFixed(1),
              fourMargin: fourM,
              totalVotes: totalVotes
            })
          }
          else{
            res.render('pollRV',{
              poll: poll[0].poll+"?",
              valueOne: poll[0].one,
              onePercent: oneP,
              oneMargin: oneM,
              valueTwo: poll[0].two,
              twoPercent: twoP,
              twoMargin: twoM,
              valueThree: poll[0].three,
              threePercent: threeP,
              threeMargin: threeM,
              valueFour: poll[0].four,
              fourPercent: fourP,
              fourMargin: fourM,
              totalVotes: totalVotes
            })
          }
        }
      
    });
  });
});

app.post('/pollVote/:poll', function(req, res){

  MongoClient.connect(uri, function (err, db) {
        
    assert.equal(null, err);
    var question = req.params.poll;
    var valueSelected = req.query.value;
    db.collection('polls').find({poll: question}).toArray(function(err, poll) {
        
        assert.equal(null, err);
      
        var totalVoters = poll[0].voters;
        totalVoters.push(req.cookies.user);
        switch(valueSelected){
        
          case poll[0].one:
            db.collection('polls').update({poll:poll[0].poll}, {$set:{voters:totalVoters}, $inc:{oneVotes: 1}}, function(err){
              assert.equal(null, err);
              db.close();
              res.send('added');
            })
            break;
            
          case poll[0].two:
            db.collection('polls').update({poll:poll[0].poll}, {$set :{voters:totalVoters}, $inc:{twoVotes: 1}}, function(err){
              assert.equal(null, err);
              db.close();
              res.send('added');
            })
            break;
            
          case poll[0].three:
            db.collection('polls').update({poll:poll[0].poll}, {$set :{voters:totalVoters}, $inc:{threeVotes: 1}}, function(err){
              assert.equal(null, err);
              db.close();
              res.send('added');
            })
            break;
            
          case poll[0].four:
            db.collection('polls').update({poll:poll[0].poll}, {$set :{voters:totalVoters}, $inc:{fourVotes: 1}}, function(err){
              assert.equal(null, err);
              db.close();
              res.send('added');
            })
            break;
        }
    });
  });
})

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.end(res.locals.message);
  //the locals variable in res can be used in the error2 file
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
