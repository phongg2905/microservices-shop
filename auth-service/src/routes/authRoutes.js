const router = require("express").Router();
const { register, login, refresh, me } = require("../controllers/authController");
const { registerValidator, loginValidator } = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/refresh", refresh);
router.get("/me", requireAuth, me);

module.exports = router;
