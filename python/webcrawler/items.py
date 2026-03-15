# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class webCrawlerItem(scrapy.Item):
    base_url = scrapy.Field()
    name = scrapy.Field()
    link = scrapy.Field()
    price = scrapy.Field()
    image_url = scrapy.Field()
    category = scrapy.Field()
    id_source = scrapy.Field()
