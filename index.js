var express = require('express');
var fs = require('fs');
require('dotenv').config();
var mongoose = require('mongoose');
var Ebook = require('./models');
var bodyParser = require('body-parser');
var app = express();


//variable
var noOfDocuments;

var fictionBooksArray = [],
  supernaturalBooksArray = [],
  romanticBooksArray = [],
  horrorBooksArray = [],
  cBooksArray = [],
  javaBooksArray = [],
  pythonBooksArray = [],
  arr=[],
  arrayOfImages=[];



// count no of documents inside collection
var query = Ebook.find();


// count no of documents
query.count(function (err, count) {
  if (err) console.log(err)
  else
    noOfDocuments = count;
});


// finding particular type of book
Ebook.find({}, function (err, result) {
  if (err) {
    console.log("error in fetching data from database" + err);
  } else {
    for (var i = 0; i < noOfDocuments; i++) {
      if (result[i].type == 'fiction') {
        fictionBooksArray.push(result[i]);
        arrayOfImages.push(result[i].image);
      }
      if (result[i].type == 'romantic') {
        romanticBooksArray.push(result[i]);
        arrayOfImages.push(result[i].image);
      }
      if (result[i].type == 'supernatural') {
        supernaturalBooksArray.push(result[i]);
        arrayOfImages.push(result[i].image);
      }
      if (result[i].type == 'horror') {
        horrorBooksArray.push(result[i]);
        arrayOfImages.push(result[i].image);
      }
      if (result[i].type == 'c') {
        cBooksArray.push(result[i]);
        arrayOfImages.push(result[i].image);
      }
      if (result[i].type == 'java') {
        javaBooksArray.push(result[i]);
        arrayOfImages.push(result[i].image);
      }
      if (result[i].type == 'python') {
        pythonBooksArray.push(result[i]);
        arrayOfImages.push(result[i].image);
      }
    }
  }
});



// setting of various pages
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
// body parser module
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});


// connect to mongoose database
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}, function (req, res) {
  console.log("connected to db");
});

// for storing data in database
app.post("/post", async function (req, res) {
  var ebookData = new Ebook({
    image: req.body.image,
    type: req.body.type,
    name: req.body.name
  })
  await ebookData.save().then(result => {
    console.log(result);
  });
});

//for storing contact us detail
app.post('/contactPost',function(req,res){
res.redirect('/');
});


// endpoint url
app.get('/', function (req, res) {     
  //fetching data from database
  Ebook.find({}, function (err, result) {
    if (err) {
      console.log("error in fetching data from database" + err);
    } else {
      res.render('index', {
        ebookImages:arrayOfImages,
        horrorBooks: horrorBooksArray,
        supernaturalBooks: supernaturalBooksArray,
        romanticBooks: romanticBooksArray,
        fictionBooks: fictionBooksArray,
        cBooks:cBooksArray,
        javaBooks:javaBooksArray,
        pythonBooks:pythonBooksArray,
      });
    }
  });
});


//endpoint fiction
app.get('/fiction', function (req, res) {
  res.render('fiction',{
    fictionBooks:fictionBooksArray
  });
});

//endpoint romantic
app.get('/romantic', function (req, res) {
  res.render('romantic',{
    romanticBooks:romanticBooksArray
  });
});

//endpoint supernatural
app.get('/supernatural', function (req, res) {
  res.render('supernatural',{
    supernaturalBooks:supernaturalBooksArray
  });
});

//endpoint horror
app.get('/horror', function (req, res) {
  res.render('horror',{
    horrorBooks:horrorBooksArray
  });
});

//endpoint coding c/c++
app.get('/coding/c', function (req, res) {
  res.render('c++Books',{
    cBooks:cBooksArray
  });
});

//endpoint coding java
app.get('/coding/java', function (req, res) {
  res.render('javaBooks',{
    javaBooks:javaBooksArray
  });
});

//endpoint coding python
app.get('/coding/python', function (req, res) {
  res.render('pythonBooks',{
    pythonBooks:pythonBooksArray
  });
});




//opening any specific  books
app.get('/books/:_id', function (req, res) {
  var postId = req.params._id;
  Ebook.find({}, function (err, result) {
    if (err) {
      console.log("error in fetching data from database" + err);
    } else {
      for (var i = 0; i < noOfDocuments; i++) {
        if (result[i]._id == postId) {
          var upperName=result[i].name.toUpperCase();
    var bookPath='./public/category/'+result[i].type+'/'+upperName+'.pdf';
    fs.readFile(bookPath ,function(err,data){
      res.contentType('application/pdf');
      res.send(data);
    });
    break;
        }
      }
    }
  });
  });

//opening any specific fiction books
app.get('/books/fiction/:_id', function (req, res) {
var postId = req.params._id;
for (i = 0; i < fictionBooksArray.length; i++) {
  if (postId == fictionBooksArray[i]._id) {
    var upperName=fictionBooksArray[i].name;
    var bookPath='./public/category/fiction/'+upperName+'.pdf';
    fs.readFile(bookPath ,function(err,data){
      res.contentType('application/pdf');
      res.send(data);
    });
    break;
  }
}
});

//opening any specific romantic books
app.get('/books/romantic/:_id', function (req, res) {
  var postId = req.params._id;
  for (i = 0; i < romanticBooksArray.length; i++) {
    if (postId == romanticBooksArray[i]._id) {
      var bookPath='./public/category/romantic/'+romanticBooksArray[i].name+'.pdf';
      fs.readFile(bookPath ,function(err,data){
        res.contentType('application/pdf');
        res.send(data);
      });
      break;
    }
  }
  });

  //opening any specific supernatural books
app.get('/books/supernatural/:_id', function (req, res) {
  var postId = req.params._id;
  for (i = 0; i < supernaturalBooksArray.length; i++) {
    if (postId == supernaturalBooksArray[i]._id) {
      var bookPath='./public/category/supernatural/'+supernaturalBooksArray[i].name+'.pdf';
      fs.readFile(bookPath ,function(err,data){
        res.contentType('application/pdf');
        res.send(data);
      });
      break;
    }
  }
  });


  //opening any specific horror books
app.get('/books/horror/:_id', function (req, res) {
  var postId = req.params._id;
  for (i = 0; i < horrorBooksArray.length; i++) {
    if (postId == horrorBooksArray[i]._id) {
      var bookPath='./public/category/horror/'+horrorBooksArray[i].name+'.pdf';
      fs.readFile(bookPath ,function(err,data){
        res.contentType('application/pdf');
        res.send(data);
      });
      break;
    }
  }
  });

   //opening any specific c/c++ books
app.get('/coding/c/:_id', function (req, res) {
  var postId = req.params._id;
  for (i = 0; i < cBooksArray.length; i++) {
    if (postId == cBooksArray[i]._id) {
      var bookPath='./public/category/coding/language/c and c++/'+cBooksArray[i].name+'.pdf';
      fs.readFile(bookPath ,function(err,data){
        res.contentType('application/pdf');
        res.send(data);
      });
      break;
    }
  }
  });


  //opening any specific java books
app.get('/coding/java/:_id', function (req, res) {
  var postId = req.params._id;
  for (i = 0; i < javaBooksArray.length; i++) {
    if (postId == javaBooksArray[i]._id) {
      var bookPath='./public/category/coding/language/java/'+javaBooksArray[i].name+'.pdf';
      fs.readFile(bookPath ,function(err,data){
        res.contentType('application/pdf');
        res.send(data);
      });
      break;
    }
  }
  });

    //opening any specific python books
app.get('/coding/python/:_id', function (req, res) {
  var postId = req.params._id;
  for (i = 0; i <pythonBooksArray.length; i++) {
    if (postId == pythonBooksArray[i]._id) {
      var bookPath='./public/category/coding/language/python/'+pythonBooksArray[i].name+'.pdf';
      fs.readFile(bookPath ,function(err,data){
        res.contentType('application/pdf');
        res.send(data);
      });
      break;
    }
  }
  });



// search books
app.get('/searchBooks', function (req, res) {
  arr=[];
  var searchQuery = req.query.searchItemName;
  searchQuery = searchQuery.toLowerCase();
  Ebook.find({}, function (err, result) {
      if (err) {
          console.log(err);
      } else {
          for (var i = 0; i < noOfDocuments; i++) {
              var matchString=result[i].name.toLowerCase();
              if (matchString.indexOf(searchQuery)>=0) {
                  arr.push(i);
              }
          }
          res.render('searchResult',{searchResult:arr,ebooks:result});
      }
  });
});


app.listen(process.env.PORT||8080, function () {
  console.log('server connected');
});