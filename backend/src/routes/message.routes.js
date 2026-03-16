const express = require("express");
const { listMessages } = require("../controllers/message.controller");

const router = express.Router({ mergeParams: true });

router.get("/", listMessages);

module.exports = router;