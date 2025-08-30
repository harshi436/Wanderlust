const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const { ref } = require("joi");

const listingSchema=new Schema({
title:{
    type:String,
    required:true,
},

description:String,

image:{//image naya deafault pic add karna ka liye mongo ki documentation jake dekho mongoosejs.com ->virtuals
//jabimage hi na ho na di hoo hamesha yeh image aya
//aur yeh jab di hoo pr nhi arahai yeh defalut aya,yeh use mai ayagi tabb  ya yeh user ka liye set ki hai jab ham frontend ka sath kaam karenge
url:String,
filename:String,

},

price:Number,
location:String,
country:String,

reviews:[
    {
        type:Schema.Types.ObjectId,
        ref:"Review",
    },
],

owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
},

category:{
    type:String,
    enum:["Trending","Rooms","Iconic Cities","Mountains","Castles","Amazing Pools","Camping","Farms","Arctic"],
    
},


});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
          await Review.deleteMany({_id:{$in: listing.reviews}});
    }

});


//model created listing
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;