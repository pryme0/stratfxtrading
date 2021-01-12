
/**
 * @file This file defines the validation schema for login and signup routes
 * the data repository which in turn queries the data
 * @author JOSEPH obochi@gmail.com> <21/06/2020 10:53am>
 * @since 0.1.0
 * Last Modified: JOSEPH <obochi2@gmail.com> <21/09/2020 04:24pm>
 */

const Joi = require('joi');

/**
 * https://tfxtrading.herokuapp.com/ | https://git.heroku.com/tfxtrading.git
 * @class Authentication
 * @classdesc An authentication schema class responsible for login and signup route
 */
class schemaValidation {
    /**
     * @description defines the req.body schema for "auth/login" route
     * @return {Joi}
     */
    static loginSchema() {
        return Joi.object({
            email: Joi.string().email().lowercase().required(),
            password: Joi.string().min(8).required().strict(),
        });
    }

    /**
     * @description defines the req.body schema for "auth/signup" route
     * @return {Joi}
     */
    static signupSchema() {
        return Joi.object({
            firstName: Joi.string()
                // accepts name only as letters and converts to lowercase
                .regex(/^[A-Za-z]+$/)
                .lowercase()
                .trim()
                .required().label('firstname')
                ,
            lastName: Joi.string()
                // accepts name only as letters and converts to lowercase
                .regex(/^[A-Za-z]+$/)
                .lowercase()
                .trim()
                .required(),
            middleName: Joi.string()
                .allow(null, ''),
            // accepts name only as letters and converts to lowercase
            email: Joi.string().email().lowercase().required(),
            password: Joi.string()
                // Minimum eight characters, at least one letter, one number and one special character:
                .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
                .min(8)
                .required()
                .strict(),
            confirmPassword: Joi.string()
                .valid(Joi.ref('password'))
                .required()
                .strict(),
        });
    }

    /**
     * @description defines the req.query schema for OAuth
     * @return {*}
     */
    static oAuthSchema() {
        return Joi.object({
            code: Joi.string().required(),
        });
    }

}

// exports class as module
module.exports = schemaValidation;