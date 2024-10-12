// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    const { userToken } = req.cookies; // Assuming you're storing the JWT in cookies

    if (userToken) {
        try {
            const decodedToken = jwt.verify(userToken, 'randomsecret'); // Verify the token
            req.userInfo = decodedToken; // Attach user info to the request
            console.log("User Info from Token:", req.userInfo);
            next(); // Proceed to the next middleware/route handler
        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).redirect('/login'); // Redirect to login if token is invalid
        }
    } else {
        return res.status(401).redirect('/login'); // Redirect to login if no token is found
    }
};

module.exports = authMiddleware;
