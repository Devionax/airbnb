// extrenal module
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const sessionDB = require("connect-mongodb-session")(expressSession);

const dbPath =
  "mongodb+srv://nuhdev:nikkofy@nuhdev.q2qrwzn.mongodb.net/airbnb?appName=nuhdev";

// internal module
const { storeRoute } = require("./routes/storeRoute");
const { hostRouter } = require("./routes/hostRoute");
const { authRouter } = require("./routes/auth+");
const { mainDomain } = require("./utils/mainPath");
const { errorControllers } = require("./controllers/errorControllers");

const app = express();
const sessionStore = new sessionDB({
  uri: dbPath,
  collection: "sessionAirbnb",
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(mainDomain.mainDomainPath, "public")));
app.use(cookieParser());
app.use(
  expressSession({
    secret: "airbnb",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
    store: sessionStore,
  })
);

// globle set
app.set("view engine", "ejs");
app.set("views", "views");

app.use(storeRoute);
app.use(authRouter);
app.use("/host", (req, res, next) => {
  console.log(`auth identifier: ${req.session.isLogined}`);
  if (req.session.isLogined) {
    next();
  } else { 
    res.redirect("/login");
  }
});
app.use("/host", hostRouter);
app.use(errorControllers.error404);

const port = 3002;

mongoose
  .connect(dbPath)
  .then(() => {
    console.log("Database Connected!");
    app.listen(port, () => {
      console.log(`The server is runing on http:/localhost:${port} `);
    });
  })
  .catch((error) => {
    console.log(`The error is come in DB Connection: ${error}`);
  });
