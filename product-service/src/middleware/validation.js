const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow('', null),
    price: Joi.number().min(0).required(),
    category: Joi.string().required(),
    stock: Joi.number().integer().min(0).required(),
    images: Joi.array().items(Joi.string().uri()).default([])
});

const validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = { validateProduct };
