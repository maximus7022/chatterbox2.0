"use strict";

module.exports = function (_, passport, validator) {
  return {
    SetRouting: function (router) {
      router.get("/", this.loginPage);
      router.get("/register", this.registerPage);

      router.post(
        "/register",
        [
          validator
            .check("username")
            .not()
            .isEmpty()
            .isLength({ min: 3 })
            .withMessage(
              "Username is required and must be at least 3 characters."
            ),
          validator
            .check("email")
            .not()
            .isEmpty()
            .isEmail()
            .withMessage("Email is invalid"),
          validator
            .check("password")
            .not()
            .isEmpty()
            .matches("re_password")
            .isLength({ min: 6 })
            .withMessage(
              "Password is required and must be at least 6 characters."
            ),
          validator
            .check("re_password")
            .not()
            .isEmpty()
            .matches("password")
            .isLength({ min: 6 })
            .withMessage(
              "Confirm password is required and must be at least 6 characters."
            ),
        ],
        this.postValidation,
        this.postRegister
      );
      router.post(
        "/",
        [
          validator
            .check("email")
            .not()
            .isEmpty()
            .isEmail()
            .withMessage("Email is invalid"),
          validator
            .check("password")
            .not()
            .isEmpty()
            .withMessage(
              "Password is required and must be at least 6 characters."
            ),
        ],
        this.postValidation,
        this.postLogin
      );
      router.get("/login", this.loginPage);
      router.post(
        "/login",
        [
          validator
            .check("email")
            .not()
            .isEmail()
            .withMessage("Email is invalid"),
          validator
            .check("email")
            .not()
            .isEmpty()
            .withMessage("Email is required"),
          validator
            .check("password")
            .not()
            .isEmpty()
            .isLength({ min: 6 })
            .withMessage("Password is reqired"),
        ],
        this.postValidation,
        this.postLogin
      );
    },

    postValidation: function (req, res, next) {
      const err = validator.validationResult(req);
      const reqErrors = err.array();
      const errors = reqErrors.filter((e) => e.msg !== "Invalid value");
      let messages = [];
      errors.forEach((error) => {
        messages.push(error.msg);
      });
      if (messages.length > 0) {
        req.flash("error", messages);
        if (req.url === "/register") {
          res.redirect("/register");
        } else if (req.url === "/") {
          res.redirect("/");
        }
      }
      return next();
    },

    registerPage: function (req, res) {
      const errors = req.flash("error");
      return res.render("register", {
        title: "Chatterbox | Login",
        messages: errors,
        hasErrors: errors.length > 0,
      });
    },
    loginPage: function (req, res) {
      const errors = req.flash("error");
      return res.render("login", {
        title: "Chatterbox | Login",
        messages: errors,
        hasErrors: errors.length > 0,
      });
    },
    forgotPage: function (req, res) {
      return res.render("forgot");
    },

    postRegister: passport.authenticate("local.signup", {
      successRedirect: "/home",
      failureRedirect: "",
      failureFlash: true,
    }),

    postLogin: passport.authenticate("local.login", {
      successRedirect: "/home",
      failureRedirect: "",
      failureFlash: true,
    }),
  };
};
