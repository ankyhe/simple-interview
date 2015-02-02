var express = require('express');
var mongo = require('mongoskin');
var app = require('../app')
var router = express.Router();

/* GET interviewee summary */
router.get('/', function(req, res, next) {
  console.log('here')
  var db = req.db;
  db.collection('interviewees').count({}, function(err, total){
    if (err) {
      res.json(500, err);
      return;
    }
    res.json({'total': total});  
  });
});

/* List interviewee by page */
router.get('/list/:page', function(req, res, next) {
  var db = req.db;
  var limit = 2; //app.config['settings.interviewee.pagesize']
  var skip = req.params.page * limit
  console.log('skip is ' + skip)

  db.collection('interviewees')
    .find({}, 
          null, 
          {
            limit: limit,
            skip: skip,
            sort: {
              '_id': -1
            }
          }).toArray( 
          function(err, obj) {
            if (err) {
              res.json(500, 'Failed to get result due to:' + e);
              return;
            } 
            var ret = {};
            ret.pagesize = limit;
            ret.pageindex = req.params.page * 1;
            ret.elements = obj;
            console.log('ret is ' + obj);
            db.collection('interviewees').count({}, function(err, total) {
              if (err) {
                next(err);
                return;
              }
              ret.total = total;
              res.json(ret);
            });
          });
});

/* Get interviewee by id */
router.get('/detail/:id', function(req, res, next) {
  var db = req.db;
  var id = req.params.id;
  console.log('id is ' + id);
  db.collection('interviewees')
    .findById(id, 
              function (err, theInterViewee) {
                if (err) {
                  res.json(404);
                  return;
                }
                console.log('theInterViewee is ' + theInterViewee);
                res.json(theInterViewee)
              });
});

module.exports = router;
