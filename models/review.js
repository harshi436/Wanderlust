const mongoose=require("mongoose");
const Schema=mongoose.Schema;


const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now(),//agr koi date define nhi ki toh by default ju date aaj ki hai woh define hoo jayegi date and time
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
    
});

module.exports=mongoose.model("Review",reviewSchema);