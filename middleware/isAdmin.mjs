import User from "../models/users.mjs";
import mongoose from "mongoose";

export const isAdmin = async (req, res, next) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(401).json({ error: "User not logged in" });
        }

        // Ensure user ID is valid before querying
        if (!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        // Efficient query to check admin status
        const verifyAdmin = await User.findById(user).select('isAdmin').exec();

        if (!verifyAdmin || !verifyAdmin.isAdmin) {
            return res.status(403).json({ error: "Unauthorized operation" });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};
