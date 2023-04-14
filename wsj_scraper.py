#!/home/gomezpa/anaconda3/envs/Capstone/bin/python

import re
from bs4 import BeautifulSoup
import random
import requests
import os
from dotenv import dotenv_values, load_dotenv

# user_agents = [
#   "Googlebot/2.1 (+http://www.google.com/bot.html)",
#   "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
#   "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/*.*.*.* Safari/537.36",
#   "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/*.*.*.* Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
# ]

def main():
    # headers = {'User-Agent': random.choice(user_agents)}
    r = requests.get('https://www.washingtonpost.com/technology/2023/03/24/enes-kanter-freedom-nba-tiktok-ban/', timeout=10)  
    soup = BeautifulSoup(r.content, 'html.parser')
    print(soup)

if __name__ == "__main__":
    main()
