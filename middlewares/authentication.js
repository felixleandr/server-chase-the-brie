const { verifyToken } = require("../helpers/auth");
const  User  = require("../model/user");

const authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;

    if (!access_token){
      throw {message: 'Invalid Token'}
    }
    const verified = verifyToken(access_token);

    const user = await User.findById(verified.id);

    if (!user){
      throw {message: 'Invalid Token'}
    }
    req.user = user;
  
    next();
  } catch (error) {
    let status, response
    if(error.message === 'Invalid Token'){
      status = 401
      response = error
    }
    res.status(status).json(response)
    // res.status(500).json({message: 'Internal server error'})
  }
};

module.exports = { authentication };
