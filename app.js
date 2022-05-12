//========================================================================================================================
//                                              ADDING FLASH MESSAGES
//========================================================================================================================

import express                 from "express";
import    bodyParser           from "body-parser";
import    mongoose             from "mongoose";
import    passport             from "passport";
import    User                 from "./models/user.js";
import    LocalStrategy        from "passport-local";
import    campgroundRoutes     from "./routes/campgrounds.js";
import    commentRoutes        from "./routes/comments.js";
import    methodOverride       from "method-override";
import    indexRoutes          from "./routes/index.js";
import    flash                from "connect-flash";
import expressSession from "express-session";
import dotenv from 'dotenv';

const app = express();
dotenv.config();
app.use(bodyParser.urlencoded({extended:true}));

const fetchVideos = async (queryObject) => {
    const options = {
     method: 'GET',
     url: `https://youtube.googleapis.com/youtube/v3/search? part=snippet&maxResults=50&id=${queryObject.channelId}&key=YOUR_API_KEY`
     };
    const result = await axios(options)
    return result.data
   }

   
                                            // For CSS FILE
// app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(flash());


const CONNECTION_URL = process.env.URL;
const PORT = process.env.PORT|| 5000;
    
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
    .catch((error) => console.log(`${error} did not connect`));
    


//_____________________________________________________________________________________________________________
//                                          PASSPORT CONFIGURATION
//_____________________________________________________________________________________________________________
app.use(expressSession({
    secret:"Rusty is the cutest dog",
    resave: false,
    saveUninitialized:false
}));

app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//_____________________________________________________________________________________________________________
//                                 MIDDLEWARE TO PASS INFO OF USER TO EVERY TEMPLATE
//_____________________________________________________________________________________________________________
                      
app.use(function(req, res , next){
    res.locals.currentUser= req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//_____________________________________________________________________________________________________________
//                                                 USING ROUTES
//                                   ADDING INITIAL ROUTE TO AVOID REPETITION
//_____________________________________________________________________________________________________________

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(indexRoutes);

app.listen(3001,function(){
    console.log("Connected");
})

