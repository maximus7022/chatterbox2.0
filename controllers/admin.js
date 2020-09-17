const path = require("path");
module.exports = function (formidable, Group) {
  let imgPath = "";
  return {
    SetRouting: function (router) {
      router.get("/dashboard", this.adminPage);

      router.post("/uploadFile", this.uploadFile);
      router.post("/dashboard", this.adminPostPage);
    },

    adminPage: function (req, res) {
      res.render("admin/dashboard");
    },
    adminPostPage: function (req, res) {
      const newGroup = new Group();
      newGroup.name = req.body.group;
      newGroup.description = req.body.description;
      newGroup.image = imgPath;
      newGroup.save((err) => {
        res.render("admin/dashboard");
      });
    },

    uploadFile: function (req, res) {
      const form = new formidable.IncomingForm();
      form.uploadDir = path.join(__dirname, "../public/uploads");
      form.keepExtensions = true;
      form.on("file", (field, file) => {
        imgPath = file.path.split("\\");
        imgLenght = imgPath.length;
        imgPath = imgPath[imgLenght - 1];
      });
      form.on("error", (err) => {});
      form.on("end", () => {});
      form.parse(req);
    },
  };
};
