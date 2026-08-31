import jwt from "jsonwebtoken";

const generateAccessToken = (userId) => {
    return jwt.sign(
        {
            userId: userId.toString()
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
};

export { generateAccessToken };