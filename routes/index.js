var express = require('express');
var router = express.Router();
var userModel = require('./users');
var postModel = require('./posts');
const passport = require("passport");
const upload = require("./multer")
const localStrategy=  require("passport-local")
passport.use(new localStrategy(userModel.authenticate()))


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { error: req.flash("error") });
});

router.get('/login', function(req, res, next) {

  res.render('login',{error:req.flash("error")});
}); 

router.get('/profile',isLoggedIn, async function(req, res, next) {
 const userdata =  await userModel.findOne({username: req.session.passport.user}).populate("posts")
//  const user2 = await userModel.findOne({username: req.session.passport.user})

res.render("profile" ,{userdata})
});




router.get('/feed',isLoggedIn,async function(req, res, next) {
const user = await userModel.findOne({username: req.session.passport.user})
const posts = await postModel.find().populate("user")
  res.render("feed",{user,posts})
});

router.post('/createpost',isLoggedIn,upload.single("postimage"),async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user})
  let postdata = await  postModel.create({
    image : req.file.filename, 
    postText: req.body.imagetitle,
    imagedescription: req.body.imagedescription,
    user: user._id
    })  
 user.posts.push(postdata._id)
 await user.save();
  res.redirect("/profile")

  });

router.post('/upload' ,isLoggedIn,upload.single("dp"),async function(req, res, next) {
const user = await userModel.findOne({username: req.session.passport.user})
  user.dp = req.file.filename, 
  await user.save();
  res.redirect("/profile" )
 
});

router.get('/add',isLoggedIn,async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user})
 
    res.render("add",{user})
  });
  







router.post('/signup', function(req, res) {
  const { username, email, fullname } = req.body;
  let user = new userModel({ username, email, fullname });
  
  userModel.register(user, req.body.password)
    .then(function(){
      passport.authenticate("local")(req, res, function(){
        res.redirect("/feed" );
      });
    })
    .catch(function(err) {
      // If registration fails, flash an error message
      req.flash("error", err.message);
      res.redirect("/"); // Redirect to the signup page
    });
});

// router.get('/signup', function(req, res, next) {
//   res.render('index', { error: req.flash("error") });
// });
router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
  
}), function(req,res){});

router.get("/logout", function(req, res) {
  req.logout(function(err) {
    if (err) { return next(err); }  
    res.redirect('/');
  });
});


function isLoggedIn(req,res,next){
if(req.isAuthenticated()) return next();
res.redirect("/")

}

// router.get('/createuser', async function(req, res,next ) {
// let createuser =  await userModel.create({ 
//     username: "hum",
//     password: "hum",
//     email:"hum@gmail.com",
//     fullname:"hum"
// });
// res.send(createuser)
// });


// router.get('/alluserposts', async function(req, res,next ) {
// let user = await userModel.findOne({_id:"65b20217af5528508a72bf8a"}).populate("posts");
// console.log(user)

// });



// router.get('/createpost', async function(req, res,next ) {
//  let createdpost = await postModel.create({ 
 
//     postText:"hellods    ////jjk'sk'",
//    user: "65b20217af5528508a72bf8a"
  
// });
// let user = await userModel.findOne({_id:"65b20217af5528508a72bf8a"})
// user.posts.push(createdpost._id)
// await user.save();
// res.send("done")
// });

  


module.exports = router;
