const jwt = require("jsonwebtoken");
const { User } = require("../models/users.models");

const authJwt = (req, res, next) => {
    const header = req.headers.authorization;
    const token = header?.split(" ")[1];
    if (!token) {
        res.status(403).json({
            success: false,
            message: "No se provee token de autenticación.",
        });
        return;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: "No autorizado",
            });
        }
        req.userId = decoded.id;
        req.firstName = decoded.firstName;
        req.role = decoded.role;
        req.email = decoded.email;
        next();
    });
};

const isAdmin = async (req, res, next) => {
    try {
        const { userId } = req;
        const foundedUser = await User.findById(userId);
        if (foundedUser.role !== "admin") {
            return res.status(401).json({
                success: false,
                message: "Rol incorrecto",
            });
        }
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { authJwt, isAdmin };
