const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");

//get jwtSignature from file config
const jwtSignature = config.get("jwtSignature");

const auth = (roles) => async(req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = await jwt.verify(token, jwtSignature);
        const allowRoles = roles || ["admin", "user"];

        //find use
        const foundedUser = await User.findOne({
            _id: decoded._id,
            tokens: token,
            role: { $in: allowRoles },
        });
        if (!foundedUser) {
            return res.status(401)
                .send({ message: "You are not authorized" });
        }
        req.user = foundedUser;
        req.token = token;

        next();
    } catch (err) {
        console.log(err.message);
        res.status(401).send({ message: err.message });
    }
};

module.exports = { auth };