const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const dotenv = require('dotenv');
dotenv.config();
var jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
var fetchuser = require('../middleware/fetchuser')
// Route 1 : Create a user using: POST "/api/auth/createUser". NO login required
router.post(
  "/createUser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //If there are errors return bad requests and errors
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    try {
        //Check whether the user with same email exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({success,error:"Sorry user with email already exists"});
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password,salt); 
      //Create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user:{
                id:user.id
        }
      }
     const authToken =  jwt.sign(data,JWT_SECRET);
      success = true;
      res.json({success,authToken});
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

//Route 2 : Authenticate a User using POST "/api/auth/login" No login required

router.post("/login",[
  body('email','Enter a valid email').isEmail(),
  body('password','Password cannot be blank').exists()
],async (req,res)=>{
//If there are errors return bad requests
let success = false;
const errors = validationResult(req);
if(!errors.isEmpty()){
 return res.status(400).json({ errors: errors.array()});
}

const{email,password} = req.body;
try{
  let user = await User.findOne({email});
  if(!user){
    return res.status(400).json({error:'Please try to login with correct credentials'})
  }

  const passwordCompare =  await bcrypt.compare(password,user.password);
  if(!passwordCompare){
    success = false
    return res.status(400).json({success,error:'Please try to login with correct credentials'})
  }

  const data = {
    user:{
                id:user.id
        }
      }
     const authToken =  jwt.sign(data,JWT_SECRET);
     success = true;
     res.json({success,authToken})
  }
  catch(error){
    console.log(error.message);
    res.status(500).send('Internal server error occured');
  }
})

//Route 3 : Get loggedIn user details using : POST "/api/auth/getuser" .Login required
router.post("/getuser",fetchuser,async (req,res)=>{
  
  try{

    var userId = req.user.id ; 
    const user = await User.findById(userId).select('-password')
    res.send(user);
  }catch(error){
    console.log(error.message);
    res.status(500).send('Internal server error occured');
  }
  })

module.exports = router;
