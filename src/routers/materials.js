import express from 'express';
const router = express.Router();
import {
	getAllProductsMaterials,
	getProductMaterialsById,
} from '../controllers/materials.js';

import { wrapAsync } from '../utils/index.js';

router.get('/', wrapAsync(getAllProductsMaterials));

router.get('/:id', wrapAsync(getProductMaterialsById));

export default router;
