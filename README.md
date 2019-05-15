# mmo-champion-rss-webhook
pulls information from google spreadsheet to get a list of URLs to send a webhook to.

mmo-bot.js will run and poll for new mmo articles.  If a new one is posted while running it will throw the contents the best it can at all the webhooks it has.

I run a cron job everyday at 2AM central US time to update the webhooks from the google spreadsheet. (`get_all_webhooks.sh`)
