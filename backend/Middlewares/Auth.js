/*
const jwt = require('jsonwebtoken');
const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.status(403)
            .json({ message: 'Unauthorized, JWT token is require' });
    }
    try {
        const decoded = jwt.verify(auth, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403)
            .json({ message: 'Unauthorized, JWT token wrong or expired' });
    }
}

module.exports = ensureAuthenticated;
*/






// middleware/ensureAuthenticated.js

const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized: JWT token is required' });
    }

    // ✅ Allow both: "Bearer tokenvalue" or just "tokenvalue"
    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.split(' ')[1] 
        : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // ✅ Attach user info to request
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Unauthorized: Invalid or expired token' });
    }
};

module.exports = ensureAuthenticated;
