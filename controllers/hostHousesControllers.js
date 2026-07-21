// External modules
const path = require("path");
const multer = require("multer");
const { unlink } = require("fs/promises");

// Internal modules
const { mainDomain } = require("../utils/mainPath");
const houses = require("../models/housesBusinessLogic");

// ------------------------------
// Multer Configuration
// ------------------------------
const uploadFolder = path.join(mainDomain.mainDomainPath, "uploads/");

const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, uploadFolder);
  },
  filename: (req, file, cd) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    console.log(file.originalname);
    console.log(uniqueSuffix);
    console.log(`${uniqueSuffix}-${file.originalname}`);

    cd(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const imgFilter = (req, file, cd) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cd(null, true);
  } else {
    cd(new Error("Only JPG, PNG, GIF images are allowed"), false);
  }
};
const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: imgFilter,
});

// ------------------------------
// Controller Functions
// ------------------------------

// Render house registration form
const housesRegistration = (req, res, next) => {
  const pageTitle = "houses registration!";
  res.render("host/addHome", {
    pageTitle,
    currentPage: null,
    isLogined: req.session.isLogined,
    isUserSignUp: req.session.isUserSignUp,
    enterUserData: req.session.loggedUser,
    multerError: null,
    newHouseData: {},
  });
};

// Handle new house submission
const displayHousesData = async (req, res, next) => {
  const Himg = req.file.filename;
  const userID = req.session.loggedUser.userId;
  const newHouseData = {
    ...req.body,
    userID,
    Himg,
  };
  req.session.newHouseData = newHouseData;
  await houses.create(newHouseData);

  const allHousesCollection = await houses.find({ userID });
  const pageTitle = "host houses details!";
  const currentPage = "hostList";

  res.render("host/hostHousesList", {
    allHousesCollection,
    pageTitle,
    currentPage,
    isLogined: req.session.isLogined,
    isUserSignUp: req.session.isUserSignUp,
    enterUserData: req.session.loggedUser,
  });
};

// Display all houses for host
const hostHousesData = async (req, res, next) => {
  const userID = req.session.loggedUser.userId;
  const allHousesCollection = await houses.find({ userID });

  const pageTitle = "houses details!";
  const currentPage = "hostList";

  res.render("host/hostHousesList", {
    allHousesCollection,
    pageTitle,
    currentPage,
    isLogined: req.session.isLogined,
    isUserSignUp: req.session.isUserSignUp,
    enterUserData: req.session.loggedUser,
  });
};

// Render edit form for a specific house
const editHostHouse = async (req, res, next) => {
  const id = req.params.editedHouseID;
  const foundHouseById = await houses.findById(id);

  if (!foundHouseById) {
    // House not found, redirect or show 404
    return res.redirect("/404");
  }

  const pageTitle = "Editing House!";

  res.render("host/editHouse", {
    foundHouseById,
    pageTitle,
    currentPage: null,
    isLogined: req.session.isLogined,
    isUserSignUp: req.session.isUserSignUp,
    enterUserData: req.session.loggedUser,
    multerError: null,
  });
};

// Handle edited house submission
const editedHouseInDataBases = async (req, res, next) => {
  const HouseId = req.body._id;
  const editedHouse = {
    Hname: req.body.Hname,
    Haddress: req.body.Haddress,
    Hfloor: req.body.Hfloor,
    Hprice: req.body.Hprice,
    Hrooms: req.body.Hrooms,
    Hrating: req.body.Hrating,
  };
  if (req.file) {
    editedHouse.Himg = req.file.filename;
  const foundHouseById = await houses.findById(HouseId);
     const imagePath = path.join(uploadFolder,foundHouseById.Himg);
    try {
      await unlink(imagePath);
      console.log(`Successfully deleted image file: ${imagePath}`);
    } catch (err) {
      console.error(`Error deleting image file: ${err}`);
    }
  }

  await houses.findByIdAndUpdate(HouseId, editedHouse, { new: true });

  res.redirect("/host/hostHouses");
};
const deleteHouse = async (req, res, next) => {
  const id = req.params.deleteHouseID;
  const houseToDelete = await houses.findById(id);
  const imagePath = path.join(uploadFolder, houseToDelete.Himg);
  try {
    await unlink(imagePath);
    console.log(`Successfully deleted image file: ${imagePath}`);
  } catch (err) {
    console.error(`Error deleting image file: ${err}`);
  }
  await houses.findByIdAndDelete(id);
  res.redirect("/host/hostHouses");
};
// ------------------------------
// Export Controllers
// ------------------------------
exports.hostControllers = {
  housesRegistration,
  upload,
  displayHousesData,
  hostHousesData,
  editHostHouse,
  editedHouseInDataBases,
  deleteHouse,
};
