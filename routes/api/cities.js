const express = require('express');
const router = express.Router();

/* GET cities API endpoint. */
router.get('/', function (req, res) {
	res.json(["Melbourne", "Sydney", "Adelaide", "Canberra", "Hobart", "Swallow Falls"]);
});

module.exports = router;
