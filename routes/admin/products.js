//external libraries
const express = require('express');
const { validationResult } = require('express-validator');
const multer = require('multer');
//internal files
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');
//declarations
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', (req, res) => {});

router.get('/admin/products/new', (req, res) => {
	res.send(productsNewTemplate({}));
});

router.post(
	'/admin/products/new',
	//here we had to change the order of the middleware
	//since bodyparser is not used, this comes second
	//[ requireTitle, requirePrice ],
	upload.single('image'),
	[ requireTitle, requirePrice ],
	async (req, res) => {
		const errors = validationResult(req);
		//console.log(errors);
		if (!errors.isEmpty()) return res.send(productsNewTemplate({ errors }));

		//a base64 string can represent an image
		//console.log(req.file.buffer.toString('base64'));
		const image = req.file.buffer.toString('base64');
		const { title, price } = req.body;

		await productsRepo.create({ title, price, image });

		return res.send('submitted');
	}
);

module.exports = router;
