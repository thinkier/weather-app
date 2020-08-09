const express = require('express');
const router = express.Router();

const cities = {
	"Melbourne": {
		temperature: {
			low: 8,
			now: 12,
			high: 15
		},
		icon: (new Date().getHours() + 6) > 12 ? "sun" : "moon",
		description: "Clear Skies"
	}
};

/* GET city API endpoint. */
router.get('/', function (req, res) {
	res.json({});
});

module.exports = router;
