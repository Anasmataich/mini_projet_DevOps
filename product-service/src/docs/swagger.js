const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Product Service API',
            version: '1.0.0',
            description: 'API for managing products in the e-commerce application',
        },
        servers: [
            {
                url: 'http://localhost:5002',
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
