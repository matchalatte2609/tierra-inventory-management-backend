import fs from 'fs';

export const getAllProductsMaterials = async (req, res, next) => {
	fs.readFile('src/seeds/mock/materials.json', 'utf8', (err, data) => {
		if (err) {
			res.status(500).send('Error reading the JSON file');
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.send(data);
		}
	});
};

export const getProductMaterialsById = async (req, res, next) => {
	const { id } = req.params;
	const fileData = await fs.promises.readFile(
		'src/seeds/materials.json',
		'utf-8'
	);
	const products = JSON.parse(fileData);
	const result = products.find((item) => item.ProductId === id) || null;
	res.json(result);
};
