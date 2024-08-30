export const signout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
        });        
        res.status(200).send({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).send({ error: "Server error" });
    }
};
