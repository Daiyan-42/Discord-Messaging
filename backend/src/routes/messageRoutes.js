const express = require("express");
const { listMessages } = require("../controllers/messageController");

const router = express.Router();

router.get(
  "/:serverId/channels/:channelId/messages",
  listMessages
);

module.exports = router;