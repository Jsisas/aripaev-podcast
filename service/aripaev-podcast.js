var cron = require("node-cron")
var axios = require("axios")
var fs = require("fs");
var xml = require("xml");


const Podcast = require('podcast');

function schedule_aripaev() {

    axios.get("https://podcastapi.aripaev.ee/api/v1/shows").then((res) => {
        var shows = res.data.shows;

        shows.forEach((show) => {
            var feed = new Podcast({
                title: show.title,
                description: show.description,
                feed_url: 'https://podcast.sisas.me/podcasts/' + show.slug + ".xml",
                site_url: 'https://www.aripaev.ee/raadio/saatesarjad/' + show.slug,
                image_url: show.imageUrl,
                author: show.authorNames.join(),
                language: 'et',
                categories: [show.categoryName],
                itunesAuthor: show.authorNames.join(),
                itunesSubtitle: show.categoryName,
                itunesSummary: show.description,
                itunesOwner: {name: 'Joosep Sisas', email: 'joosep.sisas@gmail.com'},
                itunesExplicit: false,
                itunesCategory: [{
                    "text": show.categoryName,
                }],
                itunesImage: show.imageUrl
            })

            axios.get("https://podcastapi.aripaev.ee/api/v1/shows/" + show._id + "/podcasts").then((episodes) => {
                episodes.data.podcasts.forEach((episode) => {
                    if (episode.audioUrl !== undefined) {
                        axios.head(episode.audioUrl).then((audio) => {
                            feed.addItem({
                                title: episode.title,
                                description: episode.description,
                                url: 'https://www.aripaev.ee/raadio/episood/' + show.slug, // link to the item
                                categories: [show.categoryName], // optional - array of item categories
                                author: episode.authorNames.join(), // optional - defaults to feed author property
                                date: episode.publishDate, // any format that js Date can parse.
                                enclosure: {url: episode.audioUrl},
                                length: audio.headers["content-length"],
                                itunesAuthor: episode.authorNames.join(),
                                itunesExplicit: false,
                                itunesSubtitle: show.categoryName,
                                itunesSummary: episode.description,
                                itunesNewFeedUrl: 'https://podcast.sisas.me/podcasts/' + show.slug + ".xml",
                            });

                            var podcastFeedFile = "./public/podcasts/" + show.slug + ".xml"
                            const xml = feed.buildXml();
                            createPodCastFeedFile(xml, podcastFeedFile);
                        }).catch((err) => {
                            //one episode gets 403
                            //console.log(err)
                        })
                    }
                })
            })
        })
    })

}

function createPodCastFeedFile(obj, filePath) {
    fs.writeFileSync(filePath, obj, {encoding: 'utf8', flag: 'w'})
}

module.exports = schedule_aripaev;