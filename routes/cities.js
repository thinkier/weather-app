const express = require('express');
const router = express.Router();

/* GET cities API endpoint. */
router.get('/', function (req, res) {
	res.json(["Melbourne"]);
});

module.exports = router;
