// internal module
const houses = require("../models/housesBusinessLogic");
const favouriteHousesDB = require("../models/favouriteHousesBusinessLogic");

const indexPageController = async (req, res, next) => {
  console.log(`user entered: ${req.session.loggedUser}`);
  console.log(`useris login: ${req.session.isLogined}`);
  const pageTitle = "airbnb";
  const currentPage = "home";
  const topRatedHouses = await houses.find({ Hrating: { $gte: 3 } });
  res.render("store/index", {
    topRatedHouses,
    pageTitle,
    currentPage,
    isLogined: req.session.isLogined,
    isUserSignUp: req.session.isUserSignUp,
    enterUserData: req.session.loggedUser,
  });
};

const housesLists = async (req, res, next) => {
  console.log(`houseList session checking: ${req.session.isLogined}`);
  const pageTitle = "Houses List!";
  const currentPage = "housesList";
  const allHousesCollection = await houses.find();
  res.render("store/HomesDetail", {
    allHousesCollection,
    pageTitle,
    currentPage,
    isLogined: req.session.isLogined,
    isUserSignUp: req.session.isUserSignUp,
    enterUserData: req.session.loggedUser,
  });
};
const favouriteHousesList = async (req, res, next) => {
  const userId = req.session.loggedUser.userId;
  const pageTitle = "Houses List!";
  const currentPage = "favouriteHousesList";

  const jionBothCollectionData = await favouriteHousesDB
    .find({ userID: userId }) // filter by user
    .populate("Hid");

  console.log(`favourite houses complate info: ${jionBothCollectionData}`);
  const allHousesCollection = jionBothCollectionData
    .filter((h) => h.Hid !== null)
    .map((h) => h.Hid);

  console.log(`all favourite houses: ${allHousesCollection}`);
  res.render("store/favouriteHousesList", {
    allHousesCollection,
    pageTitle,
    currentPage,
    isLogined: req.session.isLogined,
    isUserSignUp: req.session.isUserSignUp,
    enterUserData: req.session.loggedUser,
  });
};

const houseBooking = (req, res, next) => {
  const pageTitle = "Houses List!";
  const currentPage = "booking";
  res.render("store/booking", {
    pageTitle,
    currentPage,
    isLogined: req.session.isLogined,
    isUserSignUp: req.session.isUserSignUp,
    enterUserData: req.session.loggedUser,
  });
};

const singleHouseDetail = async (req, res, next) => {
  const homeId = req.params.housesID;

  const pageTitle = "Single Home";
  const singleHomeData = await houses.findById(homeId);
  // console.log(singleHomeData);
  res.render("store/singleHomeInfo", {
    singleHomeData,
    pageTitle,
    currentPage: null,
    isLogined: req.session.isLogined,
    isUserSignUp: req.session.isUserSignUp,
    enterUserData: req.session.loggedUser,
  });
};
const addToWishList = async (req, res, next) => {
  const wishedHouseId = req.body.wishedHouseId;
  const userId = req.session.loggedUser.userId;

  const isExsitHouseUnderWishList = await favouriteHousesDB.findOne({
    Hid: wishedHouseId,
    userID: userId,
  });

  if (isExsitHouseUnderWishList) {
    return res.json({ msg: `Home is already in wish list!` });
  } else {
    await favouriteHousesDB.create({
      Hid: wishedHouseId,
      userID: userId,
    });

    return res.json({ msg: `Home is added in wish list!` });
  }
};

const removeHouseFromWishList = async (req, res, next) => {
  const { removeHouseId } = req.body;
  const userId = req.session.loggedUser.userId;
  console.log(`favourite house Id:${removeHouseId}`);
  await favouriteHousesDB.findOneAndDelete({
    Hid: removeHouseId,
    userID: userId,
  });

  res.json({ redirectRoute: "/favourite_houses_list" });
};

exports.storeControllers = {
  indexPageController,
  housesLists,
  favouriteHousesList,
  houseBooking,
  singleHouseDetail,
  addToWishList,
  removeHouseFromWishList,
};
