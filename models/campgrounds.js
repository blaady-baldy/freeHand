import mongoose from "mongoose";

const campSchema = new mongoose.Schema({
    name:String,
    image:String,
    thumbnail:String,
    description:String,
    author : {
    id : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});

campSchema.pre('save', async function(next){
    try{
        const link = this.image;
        const newURL = youtube_parser(link);
        this.image = "https://www.youtube.com/embed/"+newURL;
        this.thumbnail = "https://img.youtube.com/vi/"+newURL+"/hqdefault.jpg";
        console.log(this.thumbnail);
        next()
    }
    catch(error){
        next(error)
    }
})

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

var campModel = mongoose.model("Campground", campSchema);
export default campModel;