import { Router } from "express";
var router = Router({mergeParams:true}); // To pass on the id
import comments from "../models/comments.js";
import campgrounds from "../models/campgrounds.js";
import middleware from "../middleware/index.js";

router.get("/new" , middleware.isLoggedIn , function(req,res ){
    campgrounds.findById(req.params.id,function(err,foundCamp){
        if(err) {
            console.log(err)
        } else {
            res.render("comments/new",{camp:foundCamp});
        }
    });
});

router.post("/" , middleware.isLoggedIn , function(req , res){
    campgrounds.findById(req.params.id,function(err,foundCamp){
        if(err) {
            console.log(err);
        }
        else {
                comments.create(req.body.comment,function(err,comment){
                    if(err){
                        console.log(err);
                        res.redirect("/campgrounds/");
                    } else {

                        // SAVING THE DETAILS FROM REQ.USER TO OUR COMMENT OBJECT AND PUSHING IT INTO CAMPGROUNDS
                        comment.author.id = req.user._id;
                        comment.author.username = req.user.username;
                        comment.save();
                        foundCamp.comments.push(comment);
                        foundCamp.save();
                        res.redirect("/campgrounds/" + foundCamp._id);
                        // console.log(foundCamp);
                    }
                });
        }
    });
});

router.get("/:comment_id/edit" , middleware.checkCommentOwnership ,function(req , res){
    comments.findById(req.params.comment_id , function(err , editComment){
        if(err) {
        res.redirect("back");
        }else{
            res.render("comments/edit", {camp_id : req.params.id , comment : editComment});
        }
    });
});

router.put("/:comment_id" , middleware.checkCommentOwnership, function(req , res ){
    res.redirect("/campgrounds/" + req.params.id);
    comments.findByIdAndUpdate(req.params.comment_id , req.body.updatedComment , function(err){
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:comment_id" , middleware.checkCommentOwnership ,function( req , res){
    comments.findByIdAndRemove(req.params.comment_id , function(err){
        if(err) {
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


export default router;