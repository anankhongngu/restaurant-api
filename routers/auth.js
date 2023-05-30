const express = require("express");
const router = express.Router();
const { auth } = require("../helpers/auth");


const { signupUser, signinUser, meUser, logoutUser, logoutAllUser } = require("../controllers/auth");

router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.get("/me", auth(), meUser);
router.post("/logout", auth(), logoutUser);
router.post("/logoutall", auth(), logoutAllUser);


module.exports = router;