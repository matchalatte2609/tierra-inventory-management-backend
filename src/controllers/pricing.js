import fs from 'fs';

export const getProductPricingById = async (req, res, next) => {
	const { id } = req.params;
	const fileData = await fs.promises.readFile(
		'src/seeds/pricing.json',
		'utf-8'
	);
	const products = JSON.parse(fileData);
	const result = products.find((item) => item.ProductId === id) || null;
	res.json(result);
};
