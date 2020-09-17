module.exports = function (async, Group, _) {
  return {
    SetRouting: function (router) {
      router.get("/home", this.indexPage);
    },
    indexPage: function (req, res) {
      async.parallel(
        [
          function (callback) {
            Group.find({}, (err, result) => {
              callback(err, result);
            });
          },
          function (callback) {
            Group.aggregate(
              [
                {
                  $group: {
                    _id: "$description",
                  },
                },
              ],
              (err, newResult) => {
                callback(err, newResult);
              }
            );
          },
        ],
        (err, results) => {
          const res1 = results[0];
          const res2 = results[1];
          console.log(res2);
          const chunkSize = 3;

          const dataChunk = [];
          for (let i = 0; i < res1.length; i += chunkSize) {
            dataChunk.push(res1.slice(i, i + chunkSize));
          }

          const descriptionSort = _.sortBy(res2, "_id");

          res.render("index", {
            title: "Chatterbox - Home",
            // user: req.user,
            chunks: dataChunk,
            descriptions: descriptionSort,
            // data: res3,
            // chat: res4,
          });
        }
      );
    },
  };
};
