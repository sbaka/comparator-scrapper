import json
from unittest import loader

from scrapy.spiders import SitemapSpider

from webcrawler.itemloaders import itechstoreItemLoader
from webcrawler.items import webCrawlerItem


class itechStoreSpider(SitemapSpider):
    name = "itechStore"
    source_name = "itech store"
    base_url = "https://itechstore19.com"
    id_source = 7
    allowed_domains = ["itechstore19.com"]
    sitemap_urls = ["https://itechstore19.com/sitemap.xml"]
    sitemap_rules = [
        ("/products/", "parse_product"),
    ]
    sitemap_follow = ["products_01"]

    def parse_product(self, response):
        raw = response.xpath("//product-show/@*[name()=':product']").get()
        product = json.loads(raw)

        availability = response.css("meta[property='product:availability']::attr(content)").get("")
        if availability == "out of stock":
            return
        
        loader = itechstoreItemLoader(item=webCrawlerItem(), response=response)
        loader.add_value("name", product.get("name"))
        loader.add_value("link", response.url)
        loader.add_value("price", product.get("price"))
        loader.add_value("image_url", product["images"][0]["url"])
        loader.add_value("category", "idk man")
        loader.add_value("base_url", self.base_url)
        loader.add_value("id_source", self.id_source)
        yield loader.load_item()


        


