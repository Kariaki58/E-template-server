export const signout = (req, res) => {
    try {
        res.status(200).json({
            message: 'Logged out successfully',
            clearToken: true
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
