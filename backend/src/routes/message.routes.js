const express = require("express");
const {
  sendMessage,
  listMessages,
  addReaction,
  removeReaction
} = require("../controllers/message.controller");


const {updateMessage,deleteMessage} = require("../controllers/message.controller"); 

const router = express.Router({ mergeParams: true });

router.post("/", sendMessage);

router.get("/", listMessages);

// ADD REACTION
router.put(
  "/:messageId/reactions/:emoji",
  addReaction
);

// REMOVE REACTION
router.delete(
  "/:messageId/reactions/:emoji",
  removeReaction
);
router.put("/:messageId", updateMessage);
router.delete("/:messageId", deleteMessage);

module.exports = router;