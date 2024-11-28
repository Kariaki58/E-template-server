import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

export const handleUpload = async (file) => {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
}


function extractFolderName(url) {
  const match = url.match(/upload\/(?:v\d+\/)?([^/]+)\//);
  return match ? match[1] : null;
}

function extractPath(url) {
  const match = url.match(/upload\/(?:v\d+\/)?([^/]+\/[^/]+\.[a-z]+)$/i);
  return match ? match[1] : null;
}

export const removeFromCloudinary = async (public_id) => {
  const pathToDelete = extractPath(public_id)

  try {
    const result = await cloudinary.uploader.destroy(pathToDelete.split('.')[0]);
    return result;
  } catch (error) {
    return { result: "Failed to remove file from Cloudinary." }
  }
};

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



const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

export const upload = multer({ storage });
