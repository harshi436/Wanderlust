const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//backecd ko cloudinary ka account se jodana ka liye kya kya information chahiye hogi woh info chaiye ju .env file mai saved 

//yeh cloud_name, api_key,api_secret yeh key ke naam yehi dena padeta hai config mai yahi define hai
cloudinary.config({
cloud_name:process.env.CLOUD_NAME,
api_key:process.env.CLOUD_API_KEY,
api_secret:process.env.CLOUD_API_SECRET

});

//example for storage google drive pe folder banaliye jismai file store krr raha haoo
//jaisa yaha cloudinary ka account bana liya ,pr waha kaha pr jake kaunsi file store karni hai
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats: ["png","jpg","jpeg"], // supports promises as well
    
  },
});

module.exports={
    cloudinary,
    storage
};


//procedure understand from here how image upload set
/*

low when using multer-storage-cloudinary (Case 2)

Form submission (frontend)

The browser sends a multipart/form-data request containing both:

The file (binary stream)

The form fields (text inputs)

Multer middleware kicks in

Multer reads the multipart stream.

For normal text fields → they go into req.body.

For file field (e.g. "image") → instead of saving to disk, the storage engine (multer-storage-cloudinary) immediately uploads it to Cloudinary.

Cloudinary upload happens internally (inside Multer)

Multer doesn’t give you the raw local file.

Once Cloudinary responds, Multer constructs req.file with Cloudinary’s data:

req.file = {

  path: "https://res.cloudinary.com/.../image.jpg",   // Cloudinary URL
  filename: "profile_pics/abc123",                   // Cloudinary public ID
  originalname: "mypic.jpg",                         // original filename
  mimetype: "image/jpeg",
  size: 123456

}


Your route handler runs

At this point:

req.file = Cloudinary file info

req.body = other form fields

Example:

app.post("/profile", upload.single("avatar"), (req, res) => {
  console.log(req.file.path);     // Cloudinary URL
  console.log(req.body.username); // form text field
});

✅ So the order is:

Form → Multer parses → text → req.body

File → uploaded directly to Cloudinary → Cloudinary response stored in → req.file
 */







//new

/**
 lient submits form

The form must have enctype="multipart/form-data".

Browser sends request in multipart format:

------WebKitFormBoundary
Content-Disposition: form-data; name="title"

My Post
------WebKitFormBoundary
Content-Disposition: form-data; name="description"

This is a test
------WebKitFormBoundary
Content-Disposition: form-data; name="image"; filename="cat.png"
Content-Type: image/png

(binary data of cat.png)
------WebKitFormBoundary--

2. Request reaches Express server

Normally Express body-parser cannot handle multipart (only JSON, urlencoded).

Multer acts as middleware before the route handler.

It looks at the incoming request headers → sees Content-Type: multipart/form-data.

3. Multer parses each part of the multipart request

For text fields (title, description):

Multer extracts them as strings.

Stores them in req.body.

Example:

req.body = {
  title: "My Post",
  description: "This is a test"
}


For file fields (image):

Multer streams the file contents from the request.

Uses the configured storage engine (diskStorage, memoryStorage, or Cloudinary via multer-storage-cloudinary).

Once saved/uploaded, Multer creates an object describing the file and attaches it to req.file.

Example:

req.file = {
  fieldname: 'image',
  originalname: 'cat.png',
  encoding: '7bit',
  mimetype: 'image/png',
  destination: 'uploads/',
  filename: '1692892723456-cat.png',
  path: 'uploads/1692892723456-cat.png',
  size: 12345
}

4. Request is passed to your route handler

Now Express route has both:

req.body → text inputs

req.file or req.files → file details

So your handler can do:

app.post("/upload", upload.single("image"), (req, res) => {
  console.log("Body:", req.body);   // { title, description }
  console.log("File:", req.file);   // file metadata
  res.send("Upload successful");
});

5. Optional – If using Cloudinary

Multer passes file to Cloudinary via storage engine.

Cloudinary uploads it, then replaces local path with secure_url.

Your req.file looks like:

req.file = {
  fieldname: 'image',
  originalname: 'cat.png',
  mimetype: 'image/png',
  path: 'https://res.cloudinary.com/.../cat.png', // cloud URL
  filename: 'abc123',
  size: 12345
}

 */