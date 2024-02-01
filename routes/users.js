const mongoose = require('mongoose');
const plm = require("passport-local-mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/pinterestclone")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    
  },
  password:  String,
  
  posts: [
    {
     type: mongoose.Schema.Types.ObjectId ,
     ref: "Post"
  }
],
  dp: {
    type: String 
  },
  email: {
    type: String,
    required: true,
  
  },
  fullname: {
    type: String
  }
});
userSchema.plugin(plm)
const User = mongoose.model('User', userSchema);

module.exports = User;
