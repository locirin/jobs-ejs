const express = require("express");
require("express-async-errors");
// secret word handling
require("dotenv").config();

const cookieParser = require("cookie-parser");
const csrf = require("host-csrf");

const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const app = express();

app.set("view engine", "ejs");
app.use(require("body-parser").urlencoded({ extended: true }));

app.use(helmet());
app.use(xss());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use(cookieParser(process.env.SESSION_SECRET));
const csrfMiddleware = csrf.csrf();
app.use(csrfMiddleware);
app.use((req, res, next) => {
  csrf.getToken(req, res);
  next();
});

const session = require("express-session");

// const MongoDBStore = require("connect-mongodb-session")(session);
// const url = process.env.MONGO_URI;

//  Week 18 test
const MongoDBStore = require("connect-mongodb-session")(session);

let mongoURL = process.env.MONGO_URI;
if (process.env.NODE_ENV == "test") {
  mongoURL = process.env.MONGO_URI_TEST;
}

const store = new MongoDBStore({
  // uri: url,
  uri: mongoURL,
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log(error);
});

const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,

  cookie: { secure: false, sameSite: "lax" },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sessionParms.cookie.secure = true; // serve secure cookies
}

app.use(session(sessionParms));

const passport = require("passport");
const passportInit = require("./passport/passportInit");

const auth = require("./middleware/auth");

const taskRoutes = require("./routes/taskRoutes");

passportInit();
app.use(passport.initialize());
app.use(passport.session());

app.use(require("connect-flash")());

app.use(require("./middleware/storeLocals"));

app.use((req, res, next) => {
  const oldRender = res.render;
  res.render = function (view, locals, callback) {
    res.type("html");
    return oldRender.call(this, view, locals, callback);
  };
  next();
});

app.get("/", (req, res) => {
  if (req.user) {
    if (!req.user.familyCode) {
      return res.redirect("/family-code");
    }
    return res.redirect("/tasks");
  }

  res.render("index");
});

app.use("/sessions", require("./routes/sessionRoutes"));

app.use("/tasks", auth, taskRoutes);

// let secretWord = "syzygy";
// app.get("/secretWord", auth, (req, res) => {
//   if (!req.session.secretWord) {
//     req.session.secretWord = "syzygy";
//   }

//   csrf.getToken(req, res);

//   res.locals.info = req.flash("info");
//   res.locals.errors = req.flash("error");

//   // res.render("secretWord", { secretWord: req.session.secretWord });
//   res.render("secretWord", {
//     secretWord: req.session.secretWord,
//     // _csrf: req.csrfToken(),
//   });
// });

// app.post("/secretWord", auth, (req, res) => {
//   if (req.body.secretWord.toUpperCase()[0] == "P") {
//     req.flash("error", "That word won't work!");
//     req.flash("error", "You can't use words that start with p.");
//   } else {
//     req.session.secretWord = req.body.secretWord;
//     req.flash("info", "The secret word was changed.");
//   }
//   res.redirect("/secretWord");
// });

app.get("/family-code", (req, res) => {
  if (!req.user) {
    return res.redirect("/");
  }

  res.render("familyCode");
});

app.post("/family-code", async (req, res) => {
  if (!req.user) {
    return res.redirect("/");
  }

  const code = req.body.familyCode?.trim();

  if (!code) {
    return res.send("Family code is required");
  }

  req.user.familyCode = code;
  await req.user.save();

  res.redirect("/tasks");
});

// adding /multiply route
app.get("/multiply", (req, res) => {
  let result = req.query.first * req.query.second;
  if (Number.isNaN(result)) {
    result = "NaN";
  } else if (result == null) {
    result = "null";
  }
  res.json({ result: result });
});

app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    // await require("./db/connect")(process.env.MONGO_URI);
    // updated for test
    await require("./db/connect")(mongoURL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();
module.exports = { app };
