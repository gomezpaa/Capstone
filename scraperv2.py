#!/home/gomezpa/Capstone/bin/python

from datetime import datetime
from bs4 import BeautifulSoup
import requests
import os
import mysql.connector
from dotenv import dotenv_values, load_dotenv

def foxNewsScraper():
    FOX_Lastest = requests.get('https://moxie.foxnews.com/google-publisher/latest.xml', timeout=10)

    soup =  BeautifulSoup(FOX_Lastest.content, 'xml')
    items = soup.find_all('item')

    for item in items:
        title = item.title.text
        description = item.description.text
        pubDate = item.pubDate.text
        content = item.encoded.text
        soup_content = BeautifulSoup(content, 'html.parser')
        paragraphs = soup_content.find_all('p')

        print('------------------\n', title,'\n', description, '\n', pubDate)
        for paragraph in paragraphs:
            print(paragraph.text)

def main():
    foxNewsScraper()

if __name__ == "__main__":
    main()
