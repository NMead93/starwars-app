var express = require('express');
var app = express();
var bodyParser= require('body-parser')
var MongoClient = require('mongodb').MongoClient
var mongoUrl = 'mongodb://nixter11:Seattlee13@ds163738.mlab.com:63738/star-wars-quotes';
var db;

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(bodyParser.json())

app.set('view engine', 'ejs')

app.get('/', function(req, res) {
    db.collection('quotes').find().toArray(function(err, results) {
        if (err) throw err;

        res.render('index.ejs', {quotes: results})
    });
})

app.put('/quotes', (req, res) => {
  db.collection('quotes')
  .findOneAndUpdate({name: 'yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})

MongoClient.connect(mongoUrl, (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})
