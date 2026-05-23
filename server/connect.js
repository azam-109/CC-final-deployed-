import mongoose from "mongoose";
const connectToMongodb=(async (url)=>{
    return mongoose.connect(url);
});

export default connectToMongodb;
