import jwt from 'jsonwebtoken'

export default class JwtService {
    generateToken(payload) {
        return jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        )
    }

    verifyToken(token) {
        return jwt.verify(
            token,
            process.env.JWT_SECRET
        )
    }
}