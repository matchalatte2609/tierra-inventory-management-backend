import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import pg from 'pg';
import productsRouter from './routers/products.js';
import materialsRouter from './routers/materials.js';
import pricingRouter from './routers/pricing.js';
import shapesRouter from './routers/shapes.js';
import { ExpressError } from './utils/index.js';

const app = express();

dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json());

const dbUrl = process.env.DB_URL;
const PORT = process.env.PORT || 5002;

// const pool = new Pool({
// 	connectionString: dbUrl,
// 	ssl: {
// 		rejectUnauthorized: false,
// 	},
// });

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});

app.use('/products', productsRouter);
app.use('/materials', materialsRouter);
app.use('/pricing', pricingRouter);
app.use('/shapes', shapesRouter);

app.all('*', (req, res, next) => {
	next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Something went wrong!';
	res.status(statusCode);
	res.json({ status: statusCode, message: err.message });
});
