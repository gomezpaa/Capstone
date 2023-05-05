#!/home/gomezpa/Capstone/bin/python

import re
from bs4 import BeautifulSoup
import random
import requests
import os
import mysql.connector
from dotenv import dotenv_values, load_dotenv

load_dotenv()

mydb = mysql.connector.connect(
    host="localhost",
    user=os.getenv("user"),
    password=os.getenv("password")
)

mycursor = mydb.cursor()
mycursor.execute("CREATE DATABASE IF NOT EXISTS NYT")
mycursor.execute("USE NYT")
mycursor.execute("CREATE TABLE IF NOT EXISTS news_article (article_id INT AUTO_INCREMENT PRIMARY KEY, article_text TEXT)")
mycursor.execute("CREATE TABLE IF NOT EXISTS news_items (news_id INT AUTO_INCREMENT PRIMARY KEY, news_title VARCHAR(255) UNIQUE, news_description TEXT, news_link VARCHAR(255) UNIQUE, article_id INT, FOREIGN KEY (article_id) REFERENCES news_article(article_id))")


links = []

user_agents = [
   "Googlebot/2.1 (+http://www.google.com/bot.html)",
   "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
   "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/*.*.*.* Safari/537.36",
   "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/*.*.*.* Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
]

urls = [
    'https://rss.nytimes.com/services/xml/rss/nyt/US.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/NYRegion.xml'
]

def inputDB(title, description, link, article):
    mycursor.execute('SELECT * FROM news_article WHERE article_text=%s',(article,))
    result = mycursor.fetchone()
    if result:
        articleID = result[0]
    else:
        sql = "INSERT INTO news_article (article_text) VALUES (%s)"
        val = (article,)
        mycursor.execute(sql, val)
        articleID = mycursor.lastrowid

    mycursor.fetchall()
    
    mycursor.execute("SELECT * FROM news_items WHERE news_title=%s OR news_link=%s", (title, link))
    result = mycursor.fetchall()
    if not result:
        sql = "INSERT INTO news_items (news_title, news_description, news_link, article_id) VALUES (%s, %s, %s, %s)"
        val = (title, description, link, articleID)
        mycursor.execute(sql, val)
    else:
        sql = "UPDATE news_items SET news_description=%s WHERE news_title=%s OR news_link=%s"
        val = (description, title, link)
        mycursor.execute(sql, val) 

    mycursor.fetchall();

def get_urls(url):
    for url in urls:
        headers = {'User-Agent': random.choice(user_agents)}
        r = requests.get(url, headers=headers, timeout=10)  
        soup = BeautifulSoup(r.content, 'xml')
        items = soup.find_all('item')

        for item in items:
            title = item.title.text
            description = item.description.text
            link = item.link.text
            links.append(link)
            article = get_content(link)
            print(title, "\n", description, "\n", link,"\n---------------------------------------","\n", article,"\n")
            inputDB(title, description, link, article)

def get_content(link):  
    headers = {'User-Agent': random.choice(user_agents)}
    r = requests.get(link, headers=headers)  
    soup = BeautifulSoup(r.content, 'html.parser')
    items = soup.find_all('p', class_='css-at9mc1')
    text = ""
    for item in items:
        text += item.text + " "
    return text

def main():
    get_urls(urls)
    mydb.commit()

if __name__ == "__main__":
    main()
