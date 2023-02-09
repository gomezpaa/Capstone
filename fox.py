#! /home/gomezpa/anaconda3/envs/Capstone/bin/python

from urllib.parse import quote_plus
from bs4 import BeautifulSoup
import requests
from pymongo import MongoClient

username = quote_plus("gomezpa")
password = quote_plus("Y0d@e@t$p1zza")
client_string = f"mongodb+srv://{username}:{password}@cluster.mongodb.net/Capstone"
client = MongoClient(client_string)


FOX_US = requests.get('https://moxie.foxnews.com/google-publisher/us.xml', timeout=10)

soup = BeautifulSoup(FOX_US.content, 'xml')
items = soup.find_all('item')

for item in items:
    title = item.title.text
    description = item.description.text
    link = item.guid.text
    pubDate = item.pubDate.text
