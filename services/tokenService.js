const jwt = require('jsonwebtoken')

const tokenModel = require('../models/tokenModel')

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'}),
            refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }
    async saveToken(userId, refreshToken) {
        try {
            const tokenData = await tokenModel.findOne({user: userId})
            if(tokenData) {
                tokenData.refreshToken = refreshToken
                return tokenData.save()}
            const token = await tokenModel.create({user: userId, refreshToken})
            return token
        } catch (e) {
            return null
        }

    }
}
module.exports = new TokenService()