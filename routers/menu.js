const express = require("express");
const router = express.Router();
const { postMenu, getMenu, deleteMenu, updateMenu } = require("../controllers/menu");

router.post("/menu", postMenu);
router.get("/menu", getMenu);
router.delete("/menu", deleteMenu);
router.post("/update-menu", updateMenu);

module.exports = router;