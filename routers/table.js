const express = require("express");
const router = express.Router();

const { postTable, getTable, deleteTable, updateTable } = require("../controllers/table");

router.post("/table", postTable);
router.get("/table", getTable);
router.delete("/table", deleteTable);
router.post("/table", updateTable);


module.exports = router;