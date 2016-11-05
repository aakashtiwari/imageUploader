var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/uploads/' });
var db = require('./../db');
var fs = require('fs');
var mongoose = require('mongoose');
var Grid = require("gridfs-stream");
var randomstring = require('randomstring');

var conn = mongoose.connection;
var gfs;
gfs = Grid(conn.db, mongoose.mongo);



function buildHtml(req) {
  var header = '';
  var body = '';
  var link = 'http://localhost:8080/image/' + req.file.originalname
  // concatenate header string
  // concatenate body string
  return '<!DOCTYPE html>'
       + '<html><header>' + header + '</header><body>Successfully Uploaded Image. To view <a href='+ link +'>click here</a></body></html>';
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Save Image */
router.post('/upload', upload.single('avatar'), function(req,res,next){
  //create a gridfs-stream into which we pipe multer's temporary file saved in uploads. After which we delete multer's temp file.
  var alias = randomstring.generate({
    length: 12,
    charset: 'alphabetic'
  });

  var writestream = gfs.createWriteStream({
    filename: req.file.originalname,
    aliases: alias
  });
  // //pipe multer's temp file /uploads/filename into the stream we created above. On end deletes the temporary file.
  fs.createReadStream("./public/uploads/" + req.file.filename)
    .on("end", function(){fs.unlink("./public/uploads/"+ req.file.filename, function(err){
      var html = buildHtml(req);
      res.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': html.length,
        'Expires': new Date().toUTCString()
      });
      res.end(html); })})
      .on("err", function(){res.send("Error uploading image")})
        .pipe(writestream);
});

router.get("/image/:filename", function(req, res){
  var readstream = gfs.createReadStream({filename: req.params.filename});
  readstream.on("error", function(err){
    res.send("No image found with that title");
  });
  readstream.pipe(res);
});

router.get('/views/uploaded/:alias', function(req,res){
  var readstream = gfs.createReadStream({aliases: req.params.alias});
  readstream.on("error", function(err){
    res.send("No image found with that name");
  });
  readstream.pipe(res);
})

module.exports = router;
