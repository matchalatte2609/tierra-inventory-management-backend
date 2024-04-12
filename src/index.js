const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const { Pool } = require('pg');
const fs = require('fs');

const app = express();

dotenv.config();

// Middlewares
app.use(bodyParser.json());
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

app.get('/products', (req, res) => {
	fs.readFile('src/seeds/mock/products.json', 'utf8', (err, data) => {
		if (err) {
			res.status(500).send('Error reading the JSON file');
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.send(data);
		}
	});
});

app.get('/materials', (req, res) => {
	fs.readFile('src/seeds/mock/materials.json', 'utf8', (err, data) => {
		if (err) {
			res.status(500).send('Error reading the JSON file');
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.send(data);
		}
	});
});

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
