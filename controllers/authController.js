const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Users = require("../models/authBussinessLogic");

const getLoginPage = (req, res, next) => {
  const pageTitle = "Login to Airbnb";
  res.render("auth+/login", {
    pageTitle,
    currentPage: null,
    isLogined: false,
    isUserSignUp: req.session.isUserSignUp,
    errorMessages: [],
    oldUserData: {},
    enterUserData: {},
  });
};
const signup = (req, res, next) => {
  const pageTitle = "signin to Airbnb";
  res.render("auth+/signup", {
    pageTitle,
    currentPage: null,
    isLogined: false,
    errorMessages: [],
    oldUserData: {},
    isUserSignUp: false,
    isUserSignUp: false,
    enterUserData: {},
  });
};
const validateSignup = [
  check("userName")
    .notEmpty()
    .withMessage("Username is required.")
    .trim()
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Username must contain only letters, numbers, hyphon, and underscores."
    ),
  check("userMail")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .trim(),
  check("userPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
    .trim(),
  check("userConfirmPassword").custom((value, { req }) => {
    if (value !== req.body.userPassword) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
  check("userRole")
    .isIn(["host", "guest"])
    .withMessage("Role must be either host or guest."),
];
const postSignup = async (req, res, next) => {
  const { userName, userMail, userPassword, userConfirmPassword, userRole } =
    req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const pageTitle = "signup to Airbnb";
    return res.status(422).render("auth+/signup", {
      pageTitle,
      currentPage: null,
      isLogined: false,
      errorMessages: errors.array().map((err) => err.msg),
      oldUserData: {
        userName,
        userMail,
        userPassword,
        userConfirmPassword,
        userRole,
      },
      isUserSignUp: false,
      enterUserData: {},
    });
  }
  const hashedPassword = await bcrypt.hash(userPassword, 10);
  const validUserData = {
    userName,
    userMail,
    userPassword: hashedPassword,
    userRole,
  };
  try {
    await Users.create(validUserData);
    req.session.isUserSignUp = true;

    res.redirect("/");
  } catch (err) {
    // console.log("Error creating user:", err);
    if (err.code === 11000) {
      req.session.isUserSignUp = false;
      const pageTitle = "signin to Airbnb";
      return res.render("auth+/signup", {
        pageTitle,
        currentPage: null,
        isLogined: false,
        errorMessages: [
          `Email(${err.keyValue.userMail}) is already registered`,
        ],
        oldUserData: {
          userName,
          userPassword,
          userConfirmPassword,
          userRole,
        },
        isUserSignUp: req.session.isUserSignUp,
        enterUserData: {},
      });
    }
  }
};

const postLoginDataOfUser = async (req, res, next) => {
  const { userMail, userPassword } = req.body;
  const foundUser = await Users.findOne({ userMail });
  if (!foundUser || foundUser.length === 0) {
    const pageTitle = "Login to Airbnb";
    return res.render("auth+/login", {
      pageTitle,
      currentPage: null,
      isLogined: false,
      isUserSignUp: req.session.isUserSignUp,
      errorMessages: [`Password and email not found!`],
      oldUserData: { userMail, userPassword },
      enterUserData: {},
    });
  }
  const isPasswordMatched = await bcrypt.compare(
    userPassword,
    foundUser.userPassword
  );
  if (!isPasswordMatched) {
    const pageTitle = "Login to Airbnb";
    return res.render("auth+/login", {
      pageTitle,
      currentPage: null,
      isLogined: false,
      isUserSignUp: req.session.isUserSignUp,
      errorMessages: ["password is incorrect!"],
      oldUserData: { userMail, userPassword },
      userRole: req.session.userType,
      enterUserData: {},
    });
  }
  req.session.isLogined = true;
  req.session.loggedUser = {
    userId: foundUser._id.toString(),
    userName: foundUser.userName,
    userRole: foundUser.userRole,
    userMail: foundUser.userMail,
  };
  res.redirect("/");
};

const logout = (req, res, next) => {
  console.log("Session ID before logout:", req.sessionID); // log session ID
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session:", err);
      return res.status(500).send("Could not log out");
    }

    res.clearCookie("connect.sid"); // remove session cookie
    res.redirect("/"); // redirect after logout
  });
};

exports.authController = {
  getLoginPage,
  postLoginDataOfUser,
  logout,
  signup,
  postSignup,
  validateSignup,
};
