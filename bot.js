var moment = require('moment-timezone');
var request = require('request');

var lastPost = moment().subtract(1, 'year').format(); // set the bot start time as the last post, so we only send feeds newer than the start time.

var poll = require('feed-poll')(
[ "http://www.mmo-champion.com/external.php?do=rss&type=newcontent&sectionid=1&days=120&count=10",
], 5);

// TODO: make a way to read from file and add webhooks dynamically.
var webhooks = ["https://discordapp.com/api/webhooks/370374279470120960/zh2KTJfUoYsXG3A5JUF2gcdL9JgNSvj1Dov_2JfKdrT8w5XAi4Bv37Xt2i4hvnkNKzhp",
"https://discordapp.com/api/webhooks/370456634037895168/7CCn4gga3yPNBsQiskbCanjwbxgd-KAFo7QsZDZNGFAF35FGY0lRI9ILPTwngV068cC2"]

poll.on("article", function(article) {
  var pubDate = moment(article.published); // save the publish date in a readble time format.
  //console.log("Title: " + article.title + "\nPublish Date: " + pubDate.tz("America/Chicago").format('MM/DD/YYYY h:mm:ss a') + "\nLink: " + article.link);
  //console.log(article)
  if (pubDate.diff(lastPost, 'seconds') >= 0) {
    // if the publish date is newer than the last post, then set the lastPost date to now.
    lastPost = moment().format();
    console.log("Sending new post: " + article.title)
    for (var hook in webhooks) {
      var currHook = webhooks[hook]; // get the current webhook to send to
      console.log("currhook: " + currHook)
      //POST THE webhook
      //curl -X POST --data '{ "embeds": [{"title": "Topic Title", "url": "https://example.com", "description": "This is a test for webhooks", "type": "link", "thumbnail": {"url": "https://meta-s3-cdn.freetls.fastly.net/original/3X/c/b/cb4bec8901221d4a646e45e1fa03db3a65e17f59.png"}}] }' -H "Content-Type: application/json"  https://canary.discordapp.com/api/webhooks/url
      var d = {
        "author": "name",
        "text": "[]()",
        "attachments": [{
          "color": "#ff0000",
          "fields": [{
            "title": "Error",
            "value": "`" + "msg" + "`"
          }],
          "ts": new Date() / 1000
        }]
      }
      var data = {
        "username": "MMO-Champion",
        "avatar_url": "http://static.mmo-champion.com/images/tranquilizing/logo.png",
        "embeds": [{
          "title": article.title,
          "url": article.link,
          "color": 1399932,
          "timestamp": moment().format(),
          "thumbnail": {
            "url": "http://static.mmo-champion.com/images/tranquilizing/logo.png"
          },
          "author": {
            "name": "MMO-Champion",
            "url": "http://www.mmo-champion.com",
            "icon_url": "http://static.mmo-champion.com/images/tranquilizing/logo.png"
          }
        }]
      }
      request({
        url: currHook,
        method: "POST",
        body: data,
        json: true
      });
    }
  }
});

poll.on("cycle", function() {
  console.log(lastPost)
});

poll.start();

poll.on("error", function(err) {
  console.error(err);
});
