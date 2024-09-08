import Email from "../../models/emailList.mjs";

export const getUserEmails = async (req, res) => {
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
        return res.status(400).send({ error: "page and limit must be an integer" })
    }
    
    // Validate page and limit parameters
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    if (isNaN(pageNum) || pageNum < 1 || isNaN(limitNum) || limitNum < 1) {
        return res.status(400).send({ error: "Invalid pagination parameters" });
    }

    try {
        // Fetch paginated user emails
        const emails = await Email.find({})
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .select('email'); // Select only the email field

        const total = await Email.countDocuments();

        return res.status(200).send({
            emails,
            total,
            page: pageNum,
            limit: limitNum
        });
    } catch (error) {
        return res.status(500).send({ error: "Server error, please contact staff" });
    }
};
