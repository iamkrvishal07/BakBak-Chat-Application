import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
const uploadOnCloudinary=async (filePath)=>{
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME, 
    api_key:process.env.API_KEY, 
    api_secret: process.env.API_SECRET
})
try {
    const uploadResult = await cloudinary.uploader.upload(filePath) 
    fs.unlinkSync(filePath)
    return uploadResult.secure_url

} catch (error) {
    fs.unlinkSync(filePath)
    console.log(error)
}
}

export default uploadOnCloudinary