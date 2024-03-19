const express = require("express");
const userController = require("../controllers/user");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();


router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/details", verify, userController.getProfile);

router.put('/:userId/update-to-admin', verify, verifyAdmin, userController.updateUserToAdmin);

router.put('/update-password', verify, userController.updatePassword);

//router.post('/registerUser', userController.registerUser);


module.exports = router;