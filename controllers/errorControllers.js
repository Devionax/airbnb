const multer = require("multer");

const error404 = (req, res, next) => {
  const pageTitle = "404!";
  res.status(404).render("404", {
    pageTitle,
    currentPage: null,
    isLogined: req.session.isLogined,
    isUserSignUp: req.session.isUserSignUp,
    enterUserData: req.session.loggedUser,
  });
};
// Multer error handler
const multerNewHouseAddingError = (err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message.includes("Only")) {
    const pageTitle = "houses registration!";
    const newHouseData = req.body;
    return res.render("host/addHome", {
      pageTitle,
      currentPage: null,
      isLogined: req.session.isLogined,
      isUserSignUp: req.session.isUserSignUp,
      enterUserData: req.session.loggedUser,
      multerError: err.message,
      newHouseData,
    });
  }
  next(err);
};
const multerEditError = (err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message.includes("Only")) {
    const pageTitle = "Editing House!";

    const editedData = req.body;

    return res.render("host/editHouse", {
      foundHouseById: editedData,
      pageTitle,
      currentPage: null,
      isLogined: req.session.isLogined,
      isUserSignUp: req.session.isUserSignUp,
      enterUserData: req.session.loggedUser,
      multerError: err.message,
    });
  }
  next(err);
};

exports.errorControllers = {
  error404,
  multerNewHouseAddingError,
  multerEditError,
};
