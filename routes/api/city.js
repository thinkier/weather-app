const express = require('express');
const router = express.Router();

const clear = (new Date().getHours() + 6) > 12 ? "moon" : "sun";

const cities = {
	"melbourne": {
		city: "Melbourne",
		temperature: {
			low: 8,
			now: 12,
			high: 15
		},
		weatherFaClass: clear,
		weatherDescription: "Clear Skies"
	},
	"sydney": {
		city: "Sydney",
		temperature: {
			low: 8,
			now: 12,
			high: 16
		},
		weatherFaClass: "cloud",
		weatherDescription: "Overcast"
	},
	"adelaide": {
		city: "Adelaide",
		temperature: {
			low: 7,
			now: 10,
			high: 15
		},
		weatherFaClass: "cloud-" + clear,
		weatherDescription: "Partly Cloudy"
	},
	"canberra": {
		city: "Canberra",
		temperature: {
			low: 6,
			now: 8,
			high: 10
		},
		weatherFaClass: "cloud-" + clear + "-rain",
		weatherDescription: "Chance of light rain"
	},
	"hobart": {
		city: "Hobart",
		temperature: {
			low: 1,
			now: 5,
			high: 12
		},
		weatherFaClass: clear,
		weatherDescription: "Clear"
	},
	"swallow_falls": {
		city: "Swallow Falls",
		temperature: {
			low: -5,
			now: 20,
			high: 400
		},
		weatherFaClass: "cloud-meatball",
		weatherDescription: "Cloudy with a chance of meatballs"
	}
};

/* GET city API endpoint. */
router.get('/:city', function (req, res) {
	let city = req.params.city;

	if (cities[city] !== undefined) {
		res.json(cities[city]);
		return;
	}

	res.render('error', {
		error: {
			status: 404,
			stack: '(programmatically generated)'
		}, message: 'city \"' + city + '\" not found'
	});
});

module.exports = router;
