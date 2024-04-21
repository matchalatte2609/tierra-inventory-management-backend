import express from 'express';
const router = express.Router();
import { getProductShapesById } from '../controllers/shapes.js';

import { wrapAsync } from '../utils/index.js';

router.get('/:id', wrapAsync(getProductShapesById));

export default router;
