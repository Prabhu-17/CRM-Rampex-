const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/error.middleware');
const listeners = require('./events/listeners');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));

app.use('/api', routes);

// Swagger UI (basic)
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
let swaggerSpec;
try { swaggerSpec = YAML.load('./src/docs/swagger.yaml'); } catch (err) { swaggerSpec = {}; }
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);
module.exports = app;