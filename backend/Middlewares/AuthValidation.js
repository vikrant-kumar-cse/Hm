const Joi = require('joi');




const emailValidationforSignup = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email({ tlds: { allow: false } }) // Allows all TLDs like .com, .in, .xyz etc.
            .required()
            .messages({
                'string.email': 'Please enter a valid email address like example@gmail.com',
                'string.empty': 'Email cannot be empty',
                'any.required': 'Email is required'
            })
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message, // Custom and clear error
            exampleFormat: "example@gmail.com"
        });
    }

    next();
};




const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        token: Joi.string().required(),  // Add token validation here
        name: Joi.string().min(3).max(100).required(),
        password: Joi.string().min(4).max(100).required(),
        role: Joi.string().valid('user', 'admin'),
        mobile: Joi.string()
            .pattern(/^[0-9]{10}$/)
            .required()
            .messages({
                'string.pattern.base': 'Mobile number must be a 10-digit number',
                'any.required': 'Mobile number is required'
            })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Invalid input", error });
    }
    next();
};












const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Bad request", error })
    }
    next();
}


module.exports = {
    emailValidationforSignup,
    signupValidation,
    loginValidation
}