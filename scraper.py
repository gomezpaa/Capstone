#!/home/gomezpa/anaconda3/envs/Capstone/bin/python

from datetime import datetime
from bs4 import BeautifulSoup
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
mycursor.execute("CREATE DATABASE IF NOT EXISTS test;")
mycursor.execute("USE test;")
mycursor.execute("CREATE TABLE IF NOT EXISTS nyt_us (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) UNIQUE, description VARCHAR(255), link VARCHAR(255) UNIQUE, pubDate DATE)")

NYT_US = requests.get('https://rss.nytimes.com/services/xml/rss/nyt/US.xml', timeout=10)

soup = BeautifulSoup(NYT_US.content, 'xml')
items = soup.find_all('item')

for item in items:
    title = item.title.text
    description = item.description.text
    link = item.link.text
    pubDate = item.pubDate.text
    pubDate = datetime.strptime(pubDate, '%a, %d %b %Y %H:%M:%S %z').strftime('%Y-%m-%d')
    
    mycursor.execute("SELECT * FROM nyt_us WHERE title=%s OR link=%s", (title, link))
    result = mycursor.fetchall()
    if not result:
        sql = "INSERT INTO nyt_us (title, description, link, pubDate) VALUES (%s, %s, %s, %s)"
        val = (title, description, link, pubDate)
        mycursor.execute(sql, val)
    else:
        sql = "UPDATE nyt_us SET description=%s, pubDate=%s WHERE title=%s OR link=%s"
        val = (description, pubDate, title, link)
        mycursor.execute(sql, val)

mydb.commit()
