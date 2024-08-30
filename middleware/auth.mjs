import jwt from 'jsonwebtoken'


export const generateToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token || req.cookies._auth
    if (!token) {
        return res.sendStatus(401)
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403)
        }
        req.user = user._id
        next()
    })
}