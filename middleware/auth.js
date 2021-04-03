const jwt = require('jsonwebtoken');
const Register = require('../models/registers');

const auth = async function (req, res, next) {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);

        const userInformation = await Register.findOne({_id:verifyUser._id});
        console.log(userInformation.email);

        req.token = token;
        req.userInformation = userInformation;
        next();
    } catch (error) {
        res.status(401).send(error);
    }
}


module.exports = auth;