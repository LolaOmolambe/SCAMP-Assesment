const passport = require("passport");

module.exports = (app) => {
  //Authentication using Google
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  //Callback Route
  app.get("/auth/google/callback", passport.authenticate("google"),
  (req,res) => {
    res.redirect('/api/products');
  });
  
  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });

  app.get("/api/logout", (req,res) => {
    req.logout();
    res.redirect('/');
  })
};
