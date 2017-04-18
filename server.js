var express = require("express");
var mongodb = require("mongodb");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var fs =require('fs');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/pritesh'
var app = express();
var bcrypt = require('bcrypt');
const saltRounds = 10;
app.use(bodyParser());
app.use(cookieParser());
app.use(express.static('public'));


app.get("/",function(req,res){

  res.sendFile(__dirname+"/pages/index.html")

})

app.get("/admin",function(req,res){

res.sendFile(__dirname+"/pages/admin.html")

});

app.get("/index",function(req,res){
  if(req.cookies.Email=="youareloggedin"){
    res.sendFile(__dirname+"/pages/centre.html");
  }else{
  }
  res.redirect("/admin");
});

app.get('/get_centre',function(req,res){
  var mongo = MongoClient.connect(url,function(err,db){
    var collection = db.collection('centres');
    collection.find({}).toArray(function(err,result){
      if(err){
        console.log("cannot send the error");
      }else{
        res.send(result);
      }


    })


  })


})

app.get("/processdata/:centre",function(req,res){

    res.sendFile(__dirname+"/pages/Result.html");

});
app.get("/upload_image/:centre",function(req,res){
  //check hash
  if(req.cookies.image!=""){
    bcrypt.compare(req.cookies.image, req.cookies.imageh, function(err, resa) {
      if(resa==true){
            res.sendFile(__dirname+"/pages/upload_image.html")
        }else{
            res.redirect("/upload")
        }
    });

  }else{
    res.redirect("/upload")
  }


})


//psot images
app.get('/post_image/:centre',function(req,res){
  res.send(req.params)
});

app.get('/get_answer',function(req,res){
  a=['A','B','C','D','E','F','G'];

  res.send(a);


});


app.post('/tkinter_post',function(req,res){
  console.log("Hello i am here ")
  console.log(req.body)

  var check_user = MongoClient.connect(url,function(err,db){
    if(err){
      console.log("Cannot connect to database");
    }
    var user = db.collection("tkinterupload");
    if(err){
        console.log("cannot ");
    }else{
        user.find({'username':req.body.username,'password':req.body.password}).count(function(err,result){
              console.log(result)
              if(result==1){
                  res.send("True");
              }else{
                  res.send("False");
              }
          });

        }
    });



});


app.post('/upload_image/:centre/post', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file); //create log for file information
  console.log("Uploading Data.....................................On "+req.params.centre);
  //reading file from the path
  fs.readFile(req.file.path, function (err, data) {
        //defining a new path folder in the directory
        var newPath = __dirname+"/images/"+req.params.centre+"/"+req.file.originalname;
        //writing file to the defined directory
        fs.writeFile(newPath, data, function (err) {
          //sending readed data at the response
          res.send("file uploaded");
        });
    });


})


app.post("/sign_index",function(req,res){
  console.log("Hello i am here ")
  console.log(req.body)
//  res.send(req.body.email)
  //console.log(req.ip)
  //;

  var check_user = MongoClient.connect(url,function(err,db){
    if(err){
      console.log("Cannot connect to database");
    }
    var user = db.collection("uploadusers");
    if(err){
        console.log("cannot ");
    }else{
        user.find({'username':req.body.email,'password':req.body.password,'centre':req.body.centre}).count(function(err,result){
              console.log(result)
              if(result==1){
                var salt = bcrypt.genSaltSync(saltRounds);
                var hash = bcrypt.hashSync(req.body.email, salt);
                console.log(hash);
                res.cookie("image",req.body.email,{expires: new Date(Date.now() + 60*1000), httpOnly:false} )
                res.cookie("imageh",hash,{expires: new Date(Date.now() + 60*1000), httpOnly:false} )
                res.redirect("/upload_image/"+req.body.centre);

              }else{
                  res.send("hello you are not a admin");
              }
          });

        }
      });

});

app.get('/upload',function(req,res){
  res.sendFile(__dirname+"/pages/upload.html");

});
/*
app.post('/data/:centre',function(req,res){
  var mongo = MongoClient.connect(url,function(err,db){
    if(err){
      console.log("Cannot connect to database");
    }else if(req.body.centre =="" && req.body.centre==null){
      res.send("Please have Centre in the Post Request");
    }else{
      var centre = db.collection(req.params.centre);
      centre.find({'roll':req.body.roll}).count(function(err,count){
        if(count==1){
            res.send("Already available");
            var centre = db.collection(req.params.centre);
            centre.find({'roll':req.body.roll}).toArray(function(err,data){
            if(err){
                console.log("Cannot find in centre database");
            }else{
                var Error_centre = db.collection(req.params.centre+"_Error");
                console.log(data[0]);
                Error_centre.insert(data[0],function(err,result){
                if(err){
                    console.log("Document not inserted in error database");
                }else{
                    console.log("Stored Document inserted in error database")
                        }
                });
                centre.update({'roll':req.body.roll},{$set: {'error':"True"}},function(err,result){
                  if(err){
                    console.log("Document is not modified")
                  }else{
                    console.log("Document is modified")
                  }
                });
                Error_centre.insert(req.body,function(err,result){
                if(err){
                    console.log("Document not inserted in error database");
                    }else{
                    console.log("New Document inserted in error database")
                    }
                });
                }
              });
          }else{

          var centre = db.collection(req.params.centre)
          centre.insert(req.body,function(err,result){
            if(err){
              console.log("Data cannot Inserted");
            }else{
              console.log(req.body);
              console.log("Document is inserted")
              res.send("Data is True and inserted");
            }
          });
        }


      });

    }



  });

});
*/

app.post('/data/:centre',function(req,res){
  console.log("Uploading Post data in..."+req.params.centre);
  console.log(req.body);
  var mongo = MongoClient.connect(url,function(err,db){
    if(err){
      console.log("Cannot connect to database");
    }else if(req.body.centre =="" && req.body.centre==null){
      res.send("Please have Centre in the Post Request");
    }else{
      var centre = db.collection(req.params.centre);
      centre.find({'roll':req.body.roll}).count(function(err,count){

        if(count==1){
            res.send("Already available");
            console.log("Already Available Data");
            var Error_centre = db.collection(req.params.centre+"_Error");
            req.body.Ip = req.ip;
            req.body.timeserver = new Date();
            req.body.hostname = req.headers.host;
            Error_centre.insert(req.body,function(err,result){
                if(err){
                    console.log("Document not inserted in error database");
                    }else{
                    console.log("New Document inserted in error database")
                    }
                });
            }else{
              var centre = db.collection(req.params.centre)
              req.body.Ip = req.ip;
              req.body.timeserver = new Date();
              req.body.hostname = req.headers.host;
              centre.insert(req.body,function(err,result){
              if(err){
              console.log("Data cannot Inserted");
              }else{

              console.log("Document is inserted in  "+req.params.centre+" Database")
              res.send("Data is True and inserted");
            }
          });
        }


      });

    }



  });

});

app.get('/tkinteranswer/:type',function(req,res){
  console.log("tkinteranswer Taken");
  console.log(req.params.type)
  var mongo = MongoClient.connect(url,function(err,db){
    var collection = db.collection("answers");
    collection.find({},{'_id':0}).toArray(function(err,result){
      res.send(result[req.params.type]);

    })


  })
})

app.get('/log',function(req,res){

  req.cookies==null;
  res.sendFile(__dirname+"/pages/admin.html");
})

app.get("/processdata/:centre/getcorrect",function(req,res){
console.log(req.params.centre+ "   Taking data correct");
  var mongo = MongoClient.connect(url,function(err,db){
    if(err){
      console.log("Cannot connect to database");
    }
    var collection = db.collection(req.params.centre);

    collection.find({}).toArray(function(err,result){

      res.send(result);
    })


  })

});

app.get("/processdata/:centre/geterror",function(req,res){
  console.log(req.params.centre+"  taking data");
  var mongo = MongoClient.connect(url,function(err,db){
    if(err){
      console.log("Cannot connect to database");
    }
    var collection = db.collection(req.params.centre+"_Error");

    collection.find({}).toArray(function(err,result){

      res.send(result);
    })


  })

});

app.get("/test",function(req,res){
  res.send(req.headers['x-forwarded-for'] || req.connection.remoteAddress);

});


app.post("/tkintermaster",function(req,res){
  console.log(req.body);
  var mongo = MongoClient.connect(url,function(err,db){
    if(err){
      console.log("Cannot to connect to database");
      res.send("Error")
    }else{
      var collection = db.collection("master");
      collection.find({'master':req.body.master}).count(function(err,result){
        if(result==1){
          console.log("Inserting a new user to tkinterupload"+new Date());
          var collection = db.collection("tkinterupload");
          collection.find({'username':req.body.username}).count(function(err,result){
            if(result==0){
              collection.insert({'username':req.body.username,'password':req.body.password},function(err,resa){
                if(err){
                  console.log("Username not  Inserted");
                  res.send("False")

                }else{
                  console.log("Username  Inserted");
                  res.send("True")
                }

              });
            }else{
              res.send("Username already exist")
            }
          });
        }else{
          res.send("Wrong master password")
        }
      });
    }
  });

});
app.post("/post_data/:type",function(req,res){

  res.send("data Reached");

  var mongo =MongoClient.connect(url,function(err,db){
    if(err){
      console.log("Cannot Connect to database");
    }else{
      var collection=db.collection(req.params.type);

      req.body.Ip = req.ip;
      req.body.timeserver = new Date();
      req.body.hostname = req.headers.host;

      console.log(req.body);
      collection.insert(req.body,function(err,res){
        if(err){
          console.log("Document not Inserted")
        }else{
          console.log("Document Inserted")
          db.close();
        }

      });

    }



  });
});

app.get('/get_cookie',function(req,res){
  if(req.cookies.Email=="youareloggedin"){
    res.send("youareloggedin")
  }else{
    res.redirect('/admin.html')
  }


})

app.post('/admin_login',function(req,res){

  console.log("Hello i am here ")
  console.log(req.body.email)
//  res.send(req.body.email)
  //console.log(req.ip)
  //;

  var check_user = MongoClient.connect(url,function(err,db){
    if(err){
      console.log("Cannot connect to database");
    }
    var user = db.collection("users");
    if(err){
        console.log("cannot ");
    }else{
        user.find({'username':req.body.email,'password':req.body.password}).count(function(err,result){
              console.log(result)
              if(result==1){

                  res.cookie("Email","youareloggedin",{expires: new Date(Date.now() + 60*1000), httpOnly:false} )
                  res.sendFile(__dirname+"/pages/centre.html");
              }
          });

        }
      });

});

app.get('/check',function(req,res){
var demo =req.headers['user-agent'];
console.log(demo);
res.send("hello");
});

app.listen(3355,function(){

  console.log("server started listening");

});
