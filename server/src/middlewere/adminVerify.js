const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../Models/userModel");
/* 
1.chek if token exists
2.if not token send response
3. docode the token
4.if valid token, next 
 */

module.exports = async (req, res, next) => {
    try {

        const token = req.headers?.authorization.split(" ")?.[1];
        if (!token) {
            return res
                .status(401)
                .json({ status: "fail", error: "Your are not logged in" });
        }
        // jwt.verify(() => {});
        const decoded = await promisify(jwt.verify)(
            token,
            process.env.TOKEN_SECRET
        );
        if (decoded.role !== "admin") {
            res.status(502).json({
                status: "fail",
                error: "unauthoriezed",
            });
            return;
        }
        // const user = User.findOne({ email: decoded.email });
        // req.user = user;
        // ekhane verify howyar time a user er sob data find kore pathale o hobe
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({
            status: "fail",
            error: "Invalid token",
        });
    }
};
