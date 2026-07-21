// external module
const express = require("express");

// internal module
const { storeControllers } = require("../controllers/storeHousesControllers");
const storeRoute = express.Router();

storeRoute.get("/", storeControllers.indexPageController);
storeRoute.get("/house_List", storeControllers.housesLists);
storeRoute.get("/favourite_houses_list", storeControllers.favouriteHousesList);
storeRoute.get("/house_booking", storeControllers.houseBooking);

// Dynamic routes
storeRoute.get("/house_List/:housesID", storeControllers.singleHouseDetail);

// post route

storeRoute.post("/addToWishList", storeControllers.addToWishList);
storeRoute.post("/removeHouseFromWishList" ,storeControllers.removeHouseFromWishList )

exports.storeRoute = storeRoute;
