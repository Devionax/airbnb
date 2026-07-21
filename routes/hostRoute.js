// external module
const express = require("express");

// local module
const { hostControllers } = require("../controllers/hostHousesControllers");
const { errorControllers } = require("../controllers/errorControllers");

const hostRouter = express.Router();

hostRouter.get("/add_home", hostControllers.housesRegistration);
hostRouter.get("/hostHouses", hostControllers.hostHousesData);
// Dynamic path
hostRouter.get("/editHouse/:editedHouseID", hostControllers.editHostHouse);
hostRouter.get("/deleteHouse/:deleteHouseID", hostControllers.deleteHouse);

hostRouter.post(
  "/editHome",
  hostControllers.upload.single("Himg"),
  errorControllers.multerEditError,
  hostControllers.editedHouseInDataBases
);

hostRouter.post(
  "/add_home",
  hostControllers.upload.single("Himg"),
  errorControllers.multerNewHouseAddingError,
  hostControllers.displayHousesData
);

exports.hostRouter = hostRouter;
