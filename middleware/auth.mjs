import jwt from 'jsonwebtoken';


/**
 * Generate a JWT token with a 30-day expiration
 * @param {string} _id - User ID to encode in the token
 * @returns {string} - Generated JWT token
 */
export const generateToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

/**
 * Middleware to authenticate JWT tokens from cookies
 */
export const authenticateToken = async (req, res, next) => {
    try {
        // Get token from cookies
        let authHeader = req.headers['authorization'] || req.headers['Authorization'];

        let token = authHeader.split(' ')[1];

        // Check if token is present
        if (!token) {
            return res.status(401).json({ error: 'Access Denied' });
        }
        // Verify token
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Access Denied' });
            }

            // Attach user ID to the request
            req.user = user._id;
            next();
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
