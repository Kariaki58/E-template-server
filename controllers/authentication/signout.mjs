export const signout = (req, res) => {
    try {
        // Clear the cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Ensure secure flag is set in production
            sameSite: 'None' // Required for cross-site cookies in modern browsers
        });

        // Respond with a success message
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error("Error during signout:", error); // Log error for debugging
        res.status(500).json({ error: 'Internal server error' });
    }
};
