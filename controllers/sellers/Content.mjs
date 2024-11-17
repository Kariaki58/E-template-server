import Settings from "../../models/settings.mjs";
import User from "../../models/users.mjs";
import Product from "../../models/products.mjs";
import bcrypt from "bcryptjs";
import { removeFromCloudinary } from "../../utils/cloudinary.mjs";


// Function to extract Cloudinary public ID from a URL
const extractCloudinaryPublicId = (url) => {
  const regex = /\/([^\/]+)(?=\.[a-z]{3,4}$)/; // Extract the part before the extension
  const match = url.match(regex);
  return match ? match[1] : null; // Return publicId if matched
};

// Handle incoming form data for admin content
const getAdminContent = async (req, res) => {
  try {
    const {
      mainBannerImage,
      logoImage,
      paystackKey,
      email,
      content,
      offer,
      password,
      oldPassword,
      aboutUs,
      location,
      storeName,
      storeDescription,
      contact,
      support,
      socialLinks,
      businessHours: hours,
    } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).send({ error: 'Email is required' });
    }

    // If updating password, ensure old password is provided
    if (password && !oldPassword) {
      return res.status(400).send({ error: 'Old password is required when setting a new password' });
    }
    content.map(({ question, answer }) => {
      if (!(question && answer)) {
        return res.status(400).send({ error: 'Content must include a question and answer' });
      }
    })
    // Check if a settings document already exists
    let existingSettings = await Settings.findOne();

    if (existingSettings) {
      const { mainBannerImage: bannerStoredImage, logoImage: logoStoredImage } = existingSettings;

      // Update existing settings with new data
      existingSettings = {
        ...existingSettings.toObject(),
        mainBannerImage,
        logoImage,
        paystackKey,
        aboutUs,
        location,
        content,
        offer,
        storeName,
        storeDescription,
        contact,
        support,
        socialLinks: {
          ...existingSettings.socialLinks,
          ...socialLinks,
        },
        hours: {
          ...existingSettings.hours,
          ...hours,
        },
      };

      // Update password if provided
      if (password && oldPassword) {
        const existingUser = await User.findOne({ email });
        if (existingUser && await bcrypt.compare(oldPassword, existingUser.password)) {
          const hashedPassword = await bcrypt.hash(password, 10);
          existingUser.password = hashedPassword;
          await existingUser.save();
        } else {
          return res.status(400).send({ error: 'Invalid old password' });
        }
      }

      // Update email if provided
      if (email) {
        const findUser = await User.findOne({ email });
        if (findUser) {
          findUser.email = email;
          await findUser.save();
        }
      }

      // Remove old main banner image if changed
      if (bannerStoredImage !== mainBannerImage) {
        const publicId = extractCloudinaryPublicId(bannerStoredImage);
        if (publicId) {
          await removeFromCloudinary(publicId); // Remove old image from Cloudinary
        }
      }

      // Remove old logo image if changed
      if (logoStoredImage !== logoImage) {
        const publicId = extractCloudinaryPublicId(logoStoredImage);
        if (publicId) {
          await removeFromCloudinary(publicId); // Remove old image from Cloudinary
        }
      }

      // Update the settings document with the new data
      await Settings.updateOne({}, existingSettings);
      return res.status(200).send({ message: 'Settings updated successfully' });

    } else {
      // Create a new settings document if none exists
      const newSettings = new Settings({
        mainBannerImage,
        logoImage,
        paystackKey,
        aboutUs,
        location,
        content,
        offer,
        storeName,
        storeDescription,
        contact,
        support,
        socialLinks,
        hours,
      });

      // Save the new settings document
      await newSettings.save();
      return res.status(201).send({ message: 'Settings created successfully' });
    }

  } catch (error) {
    console.error('Error in getAdminContent:', error);
    return res.status(500).send({ error: 'An error occurred while processing the request' });
  }
};

// Get settings for the admin
const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    const userInfo = await User.findOne({ _id: req.user });

    if (!settings) {
      return res.status(404).send({ error: 'Settings not found' });
    }
    
    let { page = 1, limit = 10 } = req.query;

    try {
        page = Number(page)
    } catch (error) {
        return res.status(400).send({ error: "page must be a number" })
    }

    try {
        limit = Number(limit)
    } catch (error) {
        return res.status(400).send({ error: "limit must be a number" })
    }
    
    if (!Number.isInteger(page) || !Number.isInteger(limit)) {
        return res.status(400).send({error: "page and limit must be an integer"})
    }
    const options = {
        skip: (page - 1) * limit,
        limit: parseInt(limit)
    };

    // Fetch products and total count in parallel
    const [products, total] = await Promise.all([
        Product.find({}, null, options),
        Product.countDocuments()
    ]);
    // res.status(200).json({
    //     products,
    //     total,
    //     page: parseInt(page),
    //     limit: options.limit
    // });

    const data = {
      ...settings.toObject(),
      email: userInfo.email,
      products, total, page, page: parseInt(page), limit: options.limit
    };

    return res.status(200).send(data);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).send({ error: 'Server Error, please try again' });
  }
};
const getAppLayout = async (req, res) => {
  try {
    const settings = await Settings.findOne();

    if (!settings) {
      return res.status(404).send({ error: 'Settings not found' });
    }

    return res.status(200).send(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).send({ error: 'An error occurred while fetching the settings' });
  }
}
export { getAdminContent, getSettings, getAppLayout };
