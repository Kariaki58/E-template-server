import Email from "../../models/emailList.mjs";

// Function to format date as "Year, Month, Day, Jun 23 2024"
const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
};

export const getUserEmails = async (req, res) => {
    let { page = 1, limit = 10 } = req.query;

    try {
        page = Number(page);
    } catch (error) {
        return res.status(400).send({ error: "page must be a number" });
    }

    try {
        limit = Number(limit);
    } catch (error) {
        return res.status(400).send({ error: "limit must be a number" });
    }
    
    if (!Number.isInteger(page) || !Number.isInteger(limit)) {
        return res.status(400).send({ error: "page and limit must be an integer" });
    }
    
    // Validate page and limit parameters
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    if (isNaN(pageNum) || pageNum < 1 || isNaN(limitNum) || limitNum < 1) {
        return res.status(400).send({ error: "Invalid pagination parameters" });
    }

    try {
        // Fetch paginated user emails with the createdAt field
        const emails = await Email.find({})
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .select('email createdAt'); // Select email and createdAt fields

        // Format the createdAt field for each email
        const formattedEmails = emails.map((email) => ({
            email: email.email,
            createdAt: formatDate(email.createdAt) // Format the MongoDB timestamp
        }));

        const total = await Email.countDocuments();

        return res.status(200).send({
            emails: formattedEmails,
            total,
            page: pageNum,
            limit: limitNum
        });
    } catch (error) {
        return res.status(500).send({ error: "Server error, please contact staff" });
    }
};
