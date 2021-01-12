/**
 * @file Creates and Verifies Json Web Tokens
 * @author <24/07/2020 09:15am>
 * @since 0.1.0
 * Last Modified: <obochi2@gmail.com> <26/07/2020 05:09pm>
 */

const jwt = require('jsonwebtoken');
const ALGORITHM = 'HS256';
const ISSUER = 'Tfxtradeing';
const AUDIENCE = ['user', 'newUser'];

/**
 * @class JsonWebToken
 * @classdesc A class for creating and verifying Json Web Tokens.
 */
class JsonWebToken {
    constructor(payload) {
        this.expiresIn = '1H';
        this.algorithm = ALGORITHM;
        this.secret = process.env.JWT_SECRET_KEY;
        this.issuer = ISSUER;
        this.audience = AUDIENCE;
        this.payload = payload;
    }

    /**
     * @description generates jwt token by signing app and reserved claims and jwt secret
     * @return {String} - token
     */
    create() {
        return jwt.sign(
            this.getClaims().application,
            this.secret,
            this.getClaims().reserved
        );
    }

    /**
     * @description generates application and reserved claims
     * @return {{application: {name: string, email}, reserved: {expiresIn: string, audience: [string, string], subject, issuer: string, algorithm: string}}}
     */
    getClaims() {
        const claims = {
            reserved: {
                algorithm: this.algorithm,
                issuer: this.issuer,
                audience: this.payload.audience,
                expiresIn: this.expiresIn,
                subject: this.payload._id.toString(),
            },
            application: {
                subject: this.payload._id.toString(),
                // email: this.payload.local.email,
            },
        };
        return claims;
    }

    /**
     * @description get jwt token from authorization headers
     * @param req - current request to the server
     * @return {string|null} - returns token or null if nothing found
     */
    static getToken(req) {
        if (
            req.headers &&
            req.headers.authorization &&
            req.headers.authorization.split(' ')[0] === 'Bearer'
        ) {
            return req.headers.authorization.split(' ')[1];
        } else {
            return req.params.token;
        }
        return null;
    }

    /**
     * @description claims to be validated when token is being verified
     * @return {{audience: [string, string], issuer: string, algorithm: string}}
     */
    static validateClaims() {
        return {
            algorithm: ALGORITHM,
            issuer: ISSUER,
            audience: AUDIENCE,
        };
    }

    /**
     * @description checks if token provided is valid, if yes set user property in request object
     * @return {Promise<*>}
     */
    // eslint-disable-next-line no-unused-vars
    static async verifyToken(req, res, next) {
        const token = JsonWebToken.getToken(req);
       
        if (token) {
            try {
                const decoded = await jwt.verify(
                    token,
                    process.env.JWT_SECRET_KEY,
                    // JsonWebToken.validateClaims()
                );
                req.user = {
                    id: decoded._id,
                    audience: decoded.audience,
                    role:decoded.role
                };
                next();
            } catch (e) {
                if (e.name === 'TokenExpiredError') return res.status(401).json({error:'Token Expired'});
                if (e.message === 'jwt malformed') return res.status(401).json({error:'Jwt malformed'});
                next(new AccessTokenError());
            }
        } else {
            return res.status(401).json({error:'Authorization not provided'});
        }
    }
}

module.exports = JsonWebToken;