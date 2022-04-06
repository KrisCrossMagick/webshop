const express = require('express');
const { validationResult } = require('express-validator');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();

router.get('/admin/products', (req, res) => {});

router.get('/admin/products/new', (req, res) => {
	res.send(productsNewTemplate({}));
});

router.post(
	'/admin/products/new',
	[ requireTitle, requirePrice ],
	async (req, res) => {
		const errors = validationResult(req);
		// if (!errors.isEmpty())
		// 	return res.send(productsNewTemplate({ req, errors }));

		req.on('data', (data) => {
			console.log(data.toString());
		});

		return res.send('submitted');
	}
);

module.exports = router;
