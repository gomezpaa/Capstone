#!/home/gomezpa/Capstone/bin/python

from bs4 import BeautifulSoup
import requests

headers= {'User-Agent': ''}

NYT_US = requests.get(headers=headers, url='https://www.nytimes.com/2023/05/04/us/politics/tyre-nichols-autopsy.html', timeout=10)

soup = BeautifulSoup(NYT_US.content, 'html.parser')

print(soup)
