const path = require('path');

const db = require('../database/models');

const productController = {
	productDetail: async (req, res) => {
		const boat = await db.Boat.findByPk(req.params.id);
			res.render('products/productDetail', {boat});
	},
	createListing: (req, res) => {
			res.render('products/listingForm');
	},
	catalogue: async (req, res) => {	
		const boats = await db.Boat.findAll( {
			include: ['location']
		})  
			res.render('products/catalogue', { boats });
		
		// le pasa la info de todos los botes del servidor a mi vista catalogue
	},

	edit: async (req, res) => {	
		const boat = await db.Boat.findByPk(req.params.id) 
			res.render('products/editProduct', { boat });

		// le pasa la info de todos los botes del servidor a mi vista catalogue
	},
	controlPanel: async (req, res) => {
		const boats = await db.Boat.findAll();
		const user = req.session.logged;

		if (user) {
			if (user.role == 'admin') {
				res.render('products/controlPanel', { boats });
			} else {		
				res.send('Usuario no autorizado.');
			}		
		} else {
			res.send('Not allowed, must be administrator')
		}
	},

	create: async (req, res) => {
		
		//es req.file porque lo manda por mullter

		const image = req.file.filename;

		const {
			name,
			shortDescription,
			year,
			measures,
			vesselType,
			description,
		} = req.body;

		await db.Boat.create(
			{
				name: name,
				short_description: shortDescription,
				year: year,
				measures:measures,
				vessel_type:vesselType,
				description: description,
				image: image,
			}
		)
		res.redirect("/products/catalogue")


		//es req.body porque lo manda por el body del formulario.

	
	},

	delete:  (req, res) => {
		//requiero el id del producto que fue selecccionado para eliminar
		const id = req.params.id;
		//ahora le paso ese id al modelo para que haga su magia
		db.Boat.destroy(
			{where :{id:id}}
		);

		// Por ultimo, lo redirijo a la pajina principal una vez que el archivo ya fue #destroyed
		res.redirect('/products/catalogue');
	},


	location: async (req, res) => {

	const locationId = req.params.id
	const locationFormId = req.body

	if (locationId) {
		const boats = await db.Boat.findAll( {
			
			where: {
				locations_id: locationId
			}
		})  
		res.render('products/catalogue', { boats })
	}


	}
	
	
	
	,


	update: async (req, res) => {
		const data = req.body;
		const { id } = req.params;
		// el bote original
		const boatsOriginal = db.Boat.findByPk(id);
		// la imagen original: Original.image
		// dentro de req.file va a venir la información del archivo
		const { file } = req;

		/* Si viene una imagen nueva, cargar la imagen nueva
        sino poner la original */
		let image;

		if (file) {
			image = file.filename;
		} else {
			image = boatsOriginal.image;
		}
		data.image = image;

		const {
			name,
			shortDescription,
			year,
			measures,
			vesselType,
			description,
		} = req.body;

		await db.Boat.update(
			{
				name: name,
				short_description: shortDescription,
				year: year,
				measures:measures,
				vessel_type:vesselType,
				description: description,
				image: image,
			}, {where: {id: id}}
		)
			res.redirect('/products/detail/' + id);
	}

};

module.exports = productController;
