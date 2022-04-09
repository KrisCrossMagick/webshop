//external libraries
const express = require('express');
const multer = require('multer');
//internal files
const { handleErrors, requireAuth } = require('./middlewares');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const productsEditTemplate = require('../../views/admin/products/edit');

const { requireTitle, requirePrice } = require('./validators');
//declarations
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', requireAuth, async (req, res) => {
	const products = await productsRepo.getAll();
	res.send(productsIndexTemplate({ products }));
});

router.get('/admin/products/new', requireAuth, (req, res) => {
	res.send(productsNewTemplate({}));
});

router.post(
	'/admin/products/new',
	requireAuth,
	//here we had to change the order of the middleware
	//since bodyparser is not used, this comes second
	//[ requireTitle, requirePrice ],
	upload.single('image'),
	[ requireTitle, requirePrice ],
	//no () on productsNewTemplate because we are sending a reference to the func
	//express is going to handle calling the middleware func
	handleErrors(productsNewTemplate),
	async (req, res) => {
		//a base64 string can represent an image
		//console.log(req.file.buffer.toString('base64'));
		const image = req.file.buffer.toString('base64');
		const { title, price } = req.body;

		await productsRepo.create({ title, price, image });

		res.redirect('/admin/products');
	}
);

//we use the ":id" as a wildcard and we will use this route with whatever is there
//then we will pass in this "id" as a variable for verification
router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {
	const product = await productsRepo.getOne(req.params.id);
	if (!product) return res.send('product not found');
	res.send(productsEditTemplate({ product }));
});

router.post(
	'/admin/products/:id/edit',
	requireAuth,
	upload.single('image'), //the 'image' is the name of the input in the html section
	[ requireTitle, requirePrice ],
	handleErrors(productsEditTemplate, async (req) => {
		const product = await productsRepo.getOne(req.params.id);
		return { product };
	}),
	async (req, res) => {
		const changes = req.body;
		if (req.file) changes.image = req.file.buffer.toString('base64');
		try {
			await productsRepo.update(req.params.id, changes);
		} catch (err) {
			return res.send('Could not find product');
		}

		res.redirect('/admin/products');
	}
);

router.post('/admin/products/:id/delete', requireAuth, async (req, res) => {
	await productsRepo.delete(req.params.id);

	res.redirect('/admin/products');
});

module.exports = router;
