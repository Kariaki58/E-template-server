import User from "../../models/users.mjs";

export const getUserEmails = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    // Validate page and limit parameters
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    if (isNaN(pageNum) || pageNum < 1 || isNaN(limitNum) || limitNum < 1) {
        return res.status(400).send({ error: "Invalid pagination parameters" });
    }

    try {
        // Fetch paginated user emails
        const users = await User.find({})
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .select('email'); // Select only the email field

        const total = await User.countDocuments();

        return res.status(200).send({
            emails: users.map(user => user.email),
            total,
            page: pageNum,
            limit: limitNum
        });
    } catch (error) {
        return res.status(500).send({ error: "Server error, please contact staff" });
    }
};
