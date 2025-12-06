const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./src/docs/swagger');
const productRoutes = require('./src/routes/productRoutes');
const sequelize = require('./src/config/database');

dotenv.config();

const app = express();
const port = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/products', productRoutes);

// Health Check
app.get('/', (req, res) => {
    res.json({ message: "Product Service is running 🚀" });
});

// Database Connection & Server Start
sequelize.sync({ alter: true }) // alter: true updates tables if models change
    .then(() => {
        console.log('✅ Database connected and synced');
        app.listen(port, () => {
            console.log(`🚀 Product Service running on port ${port}`);
            console.log(`📄 Swagger UI available at http://localhost:${port}/api-docs`);
        });
    })
    .catch((err) => {
        console.error('❌ Unable to connect to the database:', err);
    });
