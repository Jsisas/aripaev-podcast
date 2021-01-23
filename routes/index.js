var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  axios.get("https://podcastapi.aripaev.ee/api/v1/shows").then((response) => {
    var shows = response.data.shows;
    res.render('aripaev', { shows:  shows});
  });
});

module.exports = router;
