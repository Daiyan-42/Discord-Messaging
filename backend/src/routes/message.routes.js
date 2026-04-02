const express = require("express");
const {
  sendMessage,
  listMessages,
  addReaction,
  removeReaction
} = require("../controllers/message.controller");
const { uploadMessageAttachments } = require("../middlewares/messageUpload");


const {updateMessage,deleteMessage} = require("../controllers/message.controller"); 

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  uploadMessageAttachments.fields([
    { name: "file", maxCount: 1 },
    { name: "attachments", maxCount: 10 },
  ]),
  sendMessage
);

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