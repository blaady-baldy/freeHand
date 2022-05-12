import { Router } from "express";
var router = Router();
import passport from "passport";
import User from "../models/user.js";



router.get("/",function(req ,res){
    res.render("landing");
});

router.get("/register",function(req, res){
    res.render("register");
});

router.post("/register", function(req,res){
    var newUser = new User({username:req.body.username})
    User.register(newUser,req.body.password,function(err, user){
        if(err) {
            req.flash("error" , err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success" , "Welcome to freeHand " + user.username);
            res.redirect("/campgrounds");
        })
    });
});

router.get("/login", function(req,res){
    res.render("login");
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }), function(req, res){
});

router.get("/logout",function(req,res){
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});

export default router;