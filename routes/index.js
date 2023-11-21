const express = require("express");
const router = express.Router();

const Controller = require("../controllers/controller");
const { authentication } = require("../middlewares/authentication");
const HistoryController = require("../controllers/historyController");

router.post("/register", Controller.register);

router.post("/login", Controller.login);

router.use(authentication);

router.get("/users", Controller.userFindAll);

//router untuk singlePlayerWin+1 atau multiPlayerWin+1
router.patch("/users/:_id", Controller.incrementWins);

router.get("/users/:_id", Controller.userFindOne);

// router.delete("/users/:_id", Controller.deleteUser);

// router.get('/histories', HistoryController.findAll);

// router.post('/histories', HistoryController.createHistory);

module.exports = router;
