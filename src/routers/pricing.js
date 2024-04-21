import express from 'express';
const router = express.Router();
import { getProductPricingById } from '../controllers/pricing.js';

import { wrapAsync } from '../utils/index.js';

router.get('/:id', wrapAsync(getProductPricingById));

export default router;
