import fs from 'fs';

export const getAllProducts = async (req, res, next) => {
	fs.readFile('src/seeds/products.json', 'utf8', (err, data) => {
		if (err) {
			res.status(500).send('Error reading the JSON file');
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.send(data);
		}
	});
};

export const getProductById = async (req, res, next) => {
	const { id } = req.params;
	const fileData = await fs.promises.readFile(
		'src/seeds/products.json',
		'utf-8'
	);
	const products = JSON.parse(fileData);
	const result = products.find((item) => item.ProductId == id) || null;
	res.json(result);
};