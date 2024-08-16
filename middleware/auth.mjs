import jwt from 'jsonwebtoken'


export const generateToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '4h' });
};

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.sendStatus(401)
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403)
        }
        console.log(user)
        req.user = user._id
        next()
    })
}