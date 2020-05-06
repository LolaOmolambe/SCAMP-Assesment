const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const keys = require("./config/keys");
require("./models/User");
require("./models/Product");
require("./models/Order");
require("./models/Purchase");
require("./models/Supplier");

require("./services/passport");

mongoose.connect(keys.mongoURI);

const app = express();
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 1 * 24 * 60 * 60 * 1000,  //one day
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);
require("./routes/productRoutes")(app);
require("./routes/orderRoutes")(app);
require("./routes/purchaseRoutes")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
