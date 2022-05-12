import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {   text:String,
        author:{
            id : {
                type: mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            username:String
        }
    }
);

var commentModel = mongoose.model("Comment", commentSchema);
export default commentModel;