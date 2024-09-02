import Address from "../models/address.mjs";

export const getAddress = async (req, res) => {
    try {
        // Ensure userId is available
        const userId = req.user;
        if (!userId) {
            return res.status(401).send({ error: "User not authenticated" });
        }

        // Fetch the user's address
        const userAddress = await Address.findOne({ userId });
        
        // Check if the address exists
        if (!userAddress) {
            return res.status(404).send({ error: "Address not found" });
        }

        // Return the address information
        return res.status(200).send({ message: userAddress });

    } catch (error) {
        // Log the error for debugging
        console.error('Error fetching address:', error);

        // Return a server error response
        return res.status(500).send({ error: "Server error, please contact support" });
    }
};
