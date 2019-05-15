#!/bin/bash

echo $(date)

echo "Currently in $(pwd)"
echo "Moving to /home/wabot/mmo-champion-rss-webhook"
cd /home/wabot/mmo-champion-rss-webhook/
echo "Currently in $(pwd)"
echo "Sourcing the python environment"
source mmo-python-env/bin/activate
echo "Environment sourced"

echo "Pulling all webhooks, sorting, removing duplicates, and adding to 'new-hooks.txt'"
python google-sheets-pull-webhooks.py | sort | uniq > new-hooks.txt

echo "moving webhooks to webhooks.bkp"
mv webhooks webhooks.bkp
echo "moving new-hooks.txt to webhooks"
mv new-hooks.txt webhooks

echo "removing non standard lines"
sed -i '/discordapp\.com/!d' webhooks
echo "done"
