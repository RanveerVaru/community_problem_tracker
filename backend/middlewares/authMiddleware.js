import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized - No token provided' });
    }

    try {
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.user_token = {
            id: verifyToken.id,
            isAdmin: verifyToken.isAdmin,
        };
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized - Invalid or expired token' });
    }
};
