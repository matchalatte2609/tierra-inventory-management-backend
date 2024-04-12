import express from 'express';
const router = express.Router();
import { getAllProducts, getProductById } from '../controllers/products.js';

import { wrapAsync } from '../utils/index.js';

router.get('/', wrapAsync(getAllProducts));

router.get('/:id', wrapAsync(getProductById));

export default router;
