const passport = require("passport");
const User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, false, req.flash("error", "User already exist"));
        }

        const newUser = new User();
        newUser.username = req.body.username;
        newUser.fullname = req.body.username;
        newUser.email = req.body.email;
        newUser.main_pass = req.body.password;
        newUser.confirm_pass = req.body.re_password;
        if (newUser.main_pass !== newUser.confirm_pass) {
          return done(
            null,
            false,
            req.flash(
              "error",
              "The password and confirmation password do not match"
            )
          );
        } else {
          newUser.password = newUser.encryptPassword(req.body.password);

          newUser.save((err) => {
            done(null, newUser);
          });
        }
      });
    }
  )
);
passport.use(
  "local.login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }
        const messages = [];
        if (!user || !user.validUserPassword(password)) {
          messages.push("Login or password incorrect");
          return done(null, false, req.flash("error", messages));
        }

        return done(null, user);
      });
    }
  )
);
