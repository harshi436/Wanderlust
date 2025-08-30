const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")
const listingController=require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
//multer abb cloudinary ki storage pe jake save karayega
const upload = multer({storage})//folder ke andr save kararahe is temporary thing





router
.route("/")
.get(wrapAsync(listingController.index))

.post(isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing));


//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.get("/indexes",wrapAsync(listingController.indexes));

router.get("/search",wrapAsync(listingController.searches));

router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner, upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports=router;//router object ko export












//index route
//router.get("/",wrapAsync(listingController.index));

//create route
//router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));

//show route->ek individual listing ka pura ka pura data print karwana ,read bolte 
//router.get("/:id",wrapAsync(listingController.showListing));

//update route
//router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));


//delete route
//router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));
