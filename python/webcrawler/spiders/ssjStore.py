from unittest import loader

from scrapy.spiders import SitemapSpider
from scrapy import Request

from webcrawler.itemloaders import ssjStoreItemLoader
from webcrawler.items import webCrawlerItem

class ssjStoreSpider(SitemapSpider):
    name = "ssjStore"
    source_name = "ssj store"
    base_url = "https://ssjstoredz.com/"
    id_source = 2
    allowed_domains = ["ssjstoredz.com"]
    sitemap_urls = ["https://ssjstoredz.com/robots.txt"]
    sitemap_rules = [
         ("/products/", "parse_product"),
     ]
    sitemap_follow = ["sitemap_products"]

    def parse_product(self, response):
        # Skip if out of stock
        if response.css("button.product-form__submit[disabled]"):
            return
        loader = ssjStoreItemLoader(item=webCrawlerItem(), response=response)
        loader.add_css("name", "h1.product-template__title::text")
        loader.add_value("link", response.url)
        # Take sale price if exists, otherwise take regular price
        loader.add_css("price", "span.price-item.price-item--sale::text")
        loader.add_css("price", "span.price-item.price-item--regular::text")
        loader.add_css("image_url", "div.product-item__image-zoom::attr(data-src)")
        loader.add_value("category", "idk man")
        loader.add_value("base_url", self.base_url)
        loader.add_value("id_source", self.id_source)
        yield loader.load_item()