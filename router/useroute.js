const { Router } = require("express");
const express = require("express");
const router = express(Router);
const userData = require("../modules/user")
console.log("signUp")
router.post("/signup", userData.usersingnup); 
router.get("/", userData.getUsers);



module.exports=router;