if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}
//console.log(process.env);
//console.log(process.env.SECRET);

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport= require("passport");
const LocalStrategy= require("passport-local");
const User= require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter =require("./routes/user.js");


const dbUrl= process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});
 
async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
     mongoUrl:dbUrl,
     crypto: {
        secret:process.env.SECRET
     },
     touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,//ek hafta ka milliseconds mai hain
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};




app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
     res.locals.error=req.flash("error");
     res.locals.currUser=req.user;//jisbhi bhi user ka session chal raha hai uska info stored
   // console.log(res.locals.success);
    next();
});

/*
app.get("/demouser",async(req,res)=>{
      let fakeUser=new User({
        email:"student@gmail.com",
        username:"delta-student"
      });
      let registerdUser=await User.register(fakeUser,"helloworld");
      res.send(registerdUser);
})
*/
/*
app.get("/",(req,res)=>{
    res.send("hi, i am root");
});
*/

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
//wrapAsync
/*
app.use((err,req,res,next)=>{
    res.send("something went wrong");
}); 
*/

//ExpressError
/*
app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong"}=err;
  res.status(status).render("error.ejs",{message});
    // res.status(status).send(message);
});
*/


/*
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});
*/

app.use((req, res) => {
    res.status(404).render("error.ejs", { message: "Page Not Found" });
});

app.use((err, req, res, next) => {
    let { status = 500, message = "something went wrong" } = err;
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
        res.status(status).send(message);
    } else {
        res.status(status).render("error.ejs", { message });
    }
});


/*
app.use((err,req,res,next)=>{
    let {status=500, message="Something went wrong"} = err;
    // Example: send JSON for API clients
    res.status(status).json({
        success: false,
        error: message
    });
    // Or if you want HTML:
    // res.status(status).render("error", { err });
});
*/
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});



//----------------------------------------------------------------------------------------------------------------------------

//old code before using express.router


/*
//index route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({})
      //  console.log(res);
      res.render("listings/index",{allListings});
   
    }));

//seeeeeeeeee bahuttttt important baat hai mene pehle new route ko show route ke baad rakha toh error ayi isliye ayi kyuki,app.js mai pehla /listings/:id likha hai uske baad /listings/new likha toh app.js issa means ko id samjh raha basically new id ko search kiya jaraha hai db mai lekin woh mil nhi rahi hai toh therefore pehle new route rakha hai taki new mai render ho chiz fir id ka liye check kiya jaye 

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
});

//show route->ek individual listing ka pura ka pura data print karwana ,read bolte 
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show",{listing});
}));

//create Route
/*
app.post("/listings",async(req,res,next)=>{
   try{
    //let {title,description,image,price,country,location}=req.body this is 1st method second niche continuation
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
   }catch(err){
    next(err);
   }
});


app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
/*
    if(!req.body || !req.body.listing){
    throw new ExpressError(404,"send valid data for listing");
   }

    //let {title,description,image,price,country,location}=req.body this is 1st method second niche continuation
    const newListing=new Listing(req.body.listing);
    console.log(req.body);
    await newListing.save();
    res.redirect("/listings");
   })
);

app.get("/testlisting",async(req,res)=>{
    let sampleListing=new Listing({
        title:"my new villa",
        description:"by the beach",
        price:1200,
        location:"Calangute, Goa",
        country:"India",
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("successful testing");
});




//edit route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let { id }=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit",{listing});
    
}));



//update route yaha object ka form mai arahi hai listing therefore decontructing we are doing taki taki single single hojaye agr decontruct nhi karta aur woh object rehta toh we have to do let {title,description,image,price ,country,location} in any order u can write=req.body.listing we just to match fir update mai we have to do title=title,descrition=descerition etc

1st method:app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let listingData = req.body.listing;

    await Listing.findByIdAndUpdate(id, {
        title: listingData.title,
        description: listingData.description,
        image: listingData.image,
        price: listingData.price,
        country: listingData.country,
        location: listingData.location
    });

    res.redirect("/listings");
});

2nd method
let {title,description,image,price,country,location}=req.body.listing
 await Listing.findByIdAndUpdate(id,{title,description,image,price,country,location});


app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
     let { id }=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    //res.redirect("/listings");//yaha :id likhenge toh smajah nhi ayega yaha yeh string ki tarah treat hogi therefore to do in backtick
    res.redirect(`/listings/${id}`);
  }));

//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
   let deletedListing= await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   res.redirect("/listings");
}));


*/


//-------------------------------------------------------------------------------------------------------------------------------------------------------








/*
res.render("listings/index.ejs")
When you write the extension (.ejs) yourself:

Express does not add it again

But it tries to find exactly that file name: index.ejs.ejs in some setups

Or it bypasses your view engine setting, leading to errors or misinterpretation.

Why this fails: res.render("/listings/index")
Leading / makes Express think this is an absolute path, like:

js
Copy code
C:/listings/index
This ignores the views/ directory you set up, so the file isn't found.


app.set("views", path.join(__dirname, "views")); // 🔍 base folder
app.set("view engine", "ejs");                   // 🧩 file extension
So when you do:
js
Copy code
res.render("listings/index");
Express automatically does this behind the scenes:

js
Copy code
Render the file at: /your_project/views/listings/index.ejs
👉 You don't need to specify the .ejs or the views/ folder — Express already knows.

Why this fails: res.render("views/listings/index")
Express already starts inside the views/ folder, so adding views/ again makes it look for:

bash
Copy code
views/views/listings/index.ejs  ❌
Which does not exist.
*/



/*//wrapAsync
/*
app.use((err,req,res,next)=>{
    res.send("something went wrong");
}); */

/*
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});
*/












//important kniwlege
/**
 The main issue was that req.body was undefined when you sent an empty request without proper JSON parsing, so your code crashed before it even reached your if (!req.body.listing) check.

Why this happened
Express JSON parser wasn’t triggered

When Postman didn’t have "Content-Type": "application/json", Express’s express.json() middleware didn’t parse anything.

Result: req.body stayed undefined.

You directly accessed req.body.listing

If req.body is undefined, doing req.body.listing is like doing undefined.listing → runtime error → crash.

That’s why your if (!req.body.listing) never ran — the crash happened first.

The Fix
Check for req.body before accessing its properties:

js
Copy code
if (!req.body || !req.body.listing) {
    throw new ExpressError(404, "send valid data for listing");
}
Now:

If the request body is missing or empty → handled gracefully.

No crash before error handling.

In Postman
Set Content-Type to application/json (either via Body → raw → JSON, or Headers tab).

If you send {}, your req.body will be {}, so the above check works and throws your custom error.

So in short:
Root cause → Accessing .listing on undefined because JSON parsing didn’t happen.
Solution → Check req.body exists before using it + send proper Content-Type in Postman.

If you want, I can also show how to make all errors return JSON instead of HTML so your API responses are always consistent. That would make debugging in Postman much easier.








Ask ChatGPT

 */




/*how error handling work wrapasync expresserrorm middleware error handler


ou have three main players here:

wrapAsync → wraps async functions and automatically sends errors to the next middleware.

ExpressError → your custom error class that carries status and message.

The global error handler (app.use((err,req,res,next)=>{})) → catches all errors and sends a response.

Step-by-step flow if Listing.findById(id) throws an error
1️⃣ User hits the route
js
Copy code
app.get("/listings/:id/edit", wrapAsync(async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id); // ❌ Suppose this throws an error
    res.render("listings/edit", { listing });
}));
If the id is invalid (e.g., "123" instead of a MongoDB ObjectId) or the database query fails,
Listing.findById(id) will throw an error.

2️⃣ wrapAsync catches the error
Your wrapAsync probably looks something like:

js
Copy code
function wrapAsync(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(next); // <- Sends error to Express error handling
    }
}
Because findById threw inside an async function, catch(next) sends that error to next(err).

3️⃣ Express finds the error-handling middleware
When next(err) is called, Express skips all remaining normal middleware/routes
and looks for middleware with 4 parameters:

js
Copy code
app.use((err, req, res, next) => { ... });
4️⃣ Your global error handler runs
js
Copy code
app.use((err, req, res, next) => {
    let { status = 500, message = "something went wrong" } = err;
    res.status(status).send(message);
});
If Mongoose threw a CastError (invalid ObjectId), it doesn’t have a status,
so status defaults to 500.

message comes from the error itself if it exists; otherwise "something went wrong".

Response is sent to the client with:

json
Copy code
Status: 500
Body: "Cast to ObjectId failed for value..."
If you wanted a custom message for invalid IDs
You could catch the Mongoose CastError earlier or in a middleware:

js
Copy code
app.use((err, req, res, next) => {
    if (err.name === "CastError") {
        err = new ExpressError(400, "Invalid listing ID format");
    }
    let { status = 500, message = "something went wrong" } = err;
    res.status(status).send(message);
});


*/

//2
/*
Alright — let’s walk through your flow step-by-step so you see exactly how the error travels through your code when req.body is empty or doesn’t contain listing.

1️⃣ The incoming request
A client sends a PUT /listings/:id request, but:

Either req.body is undefined (nothing sent in the body),

Or req.body.listing is missing.

Example:

h
Copy code
PUT /listings/64adf...
Content-Type: application/json

{}
2️⃣ Route handler check
In your app.put("/listings/:id", ...):

js
Copy code
if (!req.body || !req.body.listing) {
    throw new ExpressError(404, "send valid data for listing");
}
Here:

This condition becomes true because req.body.listing doesn’t exist.

throw new ExpressError(...) is executed.

3️⃣ What happens when you throw inside wrapAsync
wrapAsync is typically something like:

js
Copy code
module.exports = fn => {
    return function(req, res, next) {
        fn(req, res, next).catch(next);
    }
}
So:

When you throw inside an async function, the Promise rejects.

wrapAsync catches that rejection and calls next(err) with your ExpressError.

4️⃣ Express’s error-handling chain
Because next(err) is called, Express skips all remaining normal route handlers.

It jumps directly to the first middleware with four parameters: (err, req, res, next).

In your code:

js
Copy code
app.use((err, req, res, next) => {
    let { status = 500, message = "something went wrong" } = err;
    res.status(status).send(message);
});
5️⃣ Error handler runs
Your ExpressError object has:

js
Copy code
{
  status: 404,
  message: "send valid data for listing"
}
The destructuring:

js
Copy code
let { status = 500, message = "something went wrong" } = err;
assigns:

ini
Copy code
status = 404
message = "send valid data for listing"
Response is sent to the client:

http
Copy code
HTTP/1.1 404 Not Found
Content-Type: text/plain

send valid data for listing
6️⃣ Summary of flow when there’s no req.body.listing
vbnet
Copy code
Incoming PUT request
   ↓
Route handler executes
   ↓
Check fails → throw ExpressError(404, "send valid data for listing")
   ↓
wrapAsync catches and calls next(err)
   ↓
Express skips to error-handling middleware
   ↓
Error middleware sends 404 response with message


*/