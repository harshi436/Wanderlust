const mongoose=require("mongoose");
const initData=require("./data.js");//require karana mai koi se variable mai  store karwa sakta haoo
const Listing=require("../models/listing.js");

const dbUrl=process.env.ATLASDB_URL;
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});
 
async function main(){
    await mongoose.connect(dbUrl);
}

const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
        ...obj, owner:"68a768af82be364048626c4c",
    }));
    await Listing.insertMany(initData.data);//initData jaha se export hua hai woh ek object banakar export hua hai jiska naam apan ne yaha initData diya jismai key value pass bua hai data:sampleListing aisa toh napan ko data ka access chahiye toh initData.data isliye likha
    console.log(" data was initialized");
};

initDB();
//pehle error isliye araha tha kyki pehla data.js mai image is in the form of object and in our schema of listing image is string there casting error coming ,tab mene apna college ka data.js dekha usmai simple url link thi therefore i delete filename bracket and keep url