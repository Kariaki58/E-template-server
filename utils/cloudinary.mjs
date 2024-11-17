import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv'

dotenv.config()

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

export default cloudinary;


// generateSignature use for cloudinary secure upload
// folder - cloudinary folder name

export const generateSignature = (req, res, next) => {
  const { folder } = req.body;

  if (!folder) {
    return res.status(404).send({error: "folder name is required"});
  }
  if (typeof folder !== 'string') {
    return res.status(404).send({error: 'folder must be a string'})
  }
  
  try {
    const timestamp = Math.round((new Date).getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request({
      timestamp,
      folder
    }, process.env.CLOUDINARY_API_SECRET);
    next()
    return res.status(201).send({timestamp, signature})
  } catch (error) {
    return res.status(500).send({error: "An error happend during file upload. please try again"})
  }
}


export const removeFromCloudinary = async (public_id_of_the_image) => {
  try {
    const result = await cloudinary.uploader.destroy(`images/${public_id_of_the_image}`);
    return result
  } catch (error) {
    return 'error occured'
  }
};