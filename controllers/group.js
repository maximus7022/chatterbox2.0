module.exports = function () {
  return {
    SetRouting: function (router) {
      router.get("/group/:name", this.groupPage);
      // router.post("/group/:name", this.groupPostPage);

      // router.get("/logout", this.logout);
    },
    groupPage: function (req, res) {
      const name = req.params.name;
      res.render("groupchat", { title: "Chatterbox Group", name: name });
    },
  };
};
