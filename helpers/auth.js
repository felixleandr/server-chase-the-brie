const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const hashPass = (password) => {
    return bcrypt.hashSync(password)
}

const comparePass = (password,hashedPassword) =>{
    return bcrypt.compareSync(password,hashedPassword)
}

const createToken = (data) => {
    return jwt.sign(data,'rahasia')
}

const verifyToken = (token) => {
    return jwt.verify(token,'rahasia')
}

module.exports= {hashPass,comparePass,createToken,verifyToken}