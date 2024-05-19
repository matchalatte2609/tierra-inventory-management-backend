import fs from 'fs';
import csv from 'csv-parser';

const csvFilePathMaterials = 'data/filtered_materials.csv';
const jsonFilePathMaterials = 'data/filtered_materials.json';

const csvFilePathProducts = 'data/filtered_product.csv';
const jsonFilePathProducts = 'data/filtered_product.json';

const csvFilePathPricing = 'data/filtered_pricing.csv';
const jsonFilePathPricing = 'data/filtered_pricing.json';
const csvFilePathShapes = 'data/filtered_shape.csv';
const jsonFilePathShapes = 'data/filtered_shape.json';

const writeCsvToJson = (csvFilePath, jsonFilePath) => {
	let data = [];

	fs.createReadStream(csvFilePath)
		.pipe(csv())
		.on('data', (row) => {
			data.push(row);
		})
		.on('end', () => {
			fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), (err) => {
				if (err) throw err;
				console.log(
					'CSV file successfully processed and JSON has been written'
				);
			});
		});
};

writeCsvToJson(csvFilePathMaterials, jsonFilePathMaterials);
writeCsvToJson(csvFilePathProducts, jsonFilePathProducts);
writeCsvToJson(csvFilePathPricing, jsonFilePathPricing);
writeCsvToJson(csvFilePathShapes, jsonFilePathShapes);
