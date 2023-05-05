#!/home/gomezpa/Capstone/bin/python

import re
from bs4 import BeautifulSoup
import random
import requests
import os
from dotenv import dotenv_values, load_dotenv
import mysql.connector
from dotenv import dotenv_values, load_dotenv

load_dotenv()

mydb = mysql.connector.connect(
    host="localhost",
    user=os.getenv("user"),
    password=os.getenv("password"),
    database = "test"
)

mycursor = mydb.cursor()
mycursor.execute("DROP TABLE IF EXISTS nytHome_US")
mycursor.execute("CREATE TABLE nytHome_US (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT, link VARCHAR(255) NOT NULL, date VARCHAR(255), full_article TEXT)")

user_agents = [
   "Googlebot/2.1 (+http://www.google.com/bot.html)",
   "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
   "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/*.*.*.* Safari/537.36",
   "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/*.*.*.* Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
]

headers = {'User-Agent': random.choice(user_agents)}
url='https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml'

def getArticle(link):
    r = requests.get(headers=headers, url=link, timeout=10)
    soup = BeautifulSoup(r.content, 'html.parser')
    items = soup.find_all('p', class_='css-at9mc1')
    text = ""
    for item in items:
        text += item.text + " "
    return text

def inputDB(title, link, description, date, article):
    sql = "INSERT INTO nytHome_US (title, description, link, date, full_article) VALUES (%s,%s,%s,%s,%s)"
    val = (title, description, link, date, article)
    mycursor.execute(sql, val)
    mycursor.fetchall()

def main():
    r = requests.get(headers=headers, url=url, timeout=10)  
    soup = BeautifulSoup(r.content, 'xml')
    items = soup.find_all('item')

    for item in items:
        title = item.title.text
        link = item.link.text
        description = item.description.text
        date = item.pubDate.text
        article = getArticle(link)
        print("------","\n",link,"\n",title,"\n",description,"\n", date, "\n", article)
        inputDB(title, link, description, date, article)
        mydb.commit()

if __name__ == "__main__":
    main()
