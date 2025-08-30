//const { list } = require("postcss");
const Listing=require("../models/listing");

module.exports.index=async (req,res)=>{
    const allListings= await Listing.find({})
      //  console.log(res);
      res.render("listings/index",{allListings});
   
    };

module.exports.renderNewForm= (req,res)=>{
    res.render("listings/new");
};


module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({
       path:"reviews",
      populate:{
       path:"author",
      }//nested populate is done
})
.populate("owner");
if(!listing){
       req.flash("error","Listing you requested does not exit");
      return res.redirect("/listings");
      }
      console.log(listing)
      res.render("listings/show",{listing});
};


module.exports.createListing=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,"...",filename);
  
 const newListing=new Listing(req.body.listing);
  console.log(req.body);
  //console.log(req.user);
   newListing.owner=req.user._id;

   newListing.image={url,filename};

  await newListing.save();

   req.flash("success","New Listing Created");
    res.redirect("/listings");
   };

module.exports.renderEditForm=async (req,res)=>{
    let { id }=req.params;
    const listing=await Listing.findById(id);
   if(!listing){
       req.flash("error","Listing you requested does not exit");
      return res.redirect("/listings");
      }

      let originalImageUrl=listing.image.url;
         originalImageUrl= originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit",{listing,originalImageUrl});
    
};


//js ka andr kisi bhi variable ki value check krni hai ki woh undefine hai ya nhi hai we use type of
module.exports.updateListing=async (req,res)=>{
     let { id }=req.params;

 let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    //res.redirect("/listings");//yaha :id likhenge toh smajah nhi ayega yaha yeh string ki tarah treat hogi therefore to do in backtick
  if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
  }
  req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
  };

module.exports.destroyListing=async(req,res)=>{
    let {id}= req.params;
   let deletedListing= await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("success","Listing deleted Succesfully")
   res.redirect("/listings");
};

module.exports.indexes = async (req, res) => {
  const { category } = req.query; // get category from URL query
console.log(category);
  let query = {};
  if (category) {
    query.category = category; // only fetch listings of that category
  }

  const allListings = await Listing.find(query);
  res.render("listings/indexes", { allListings, selectedCategory: category || "" });
};

module.exports.searches=async(req,res)=>{
  try {
    const { country } = req.query; // get the country from query string
    if (!country) {
      return res.redirect("/"); // if empty, redirect to home or show all
    }

    // Case-insensitive search for country
    const listings = await Listing.find({
      country: { $regex: new RegExp(`^${country}$`, "i") }
    });

    res.render("listings/searchResults", { listings, country });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }

};
