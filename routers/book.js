const express = require("express");
const router = express.Router();
const { auth } = require("../helpers/auth");

const { postBookTable, postBook, getBook, getAllBook } = require("../controllers/book");

router.post("/book", auth(["admin"]), postBook);
router.get("/book", auth(), getBook);
router.get("/allbook", getAllBook);
//
router.post("/book/booking", auth(), postBookTable);

module.exports = router;