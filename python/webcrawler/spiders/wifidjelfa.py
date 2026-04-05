from scrapy.spiders import SitemapSpider
from webcrawler.itemloaders import wifiDjelfaItemLoader
from webcrawler.items import webCrawlerItem

class wifiDjelfaSpider(SitemapSpider):
    name = "wifiDjelfa"
    custom_settings = {
        "USER_AGENT": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36"
    }
    source_name = "wifi djelfa"
    base_url = "https://wifidjelfa.com/"
    id_source = 3
    allowed_domains = ["wifidjelfa.com"]
    sitemap_urls = ["https://wifidjelfa.com/robots.txt"]
    sitemap_rules = [
         (".*", "parse_product"),
     ]
    sitemap_follow = ["product-sitemap"]
    #start_urls = ["https://wifidjelfa.com/product/geforce-rtx-3070-8gb-gigabyte-gaming-oc-8gb-new/"]


    def parse_product(self, response):
        # Skip if out of stock
        if response.css(".stock.out-of-stock"):
            return
        loader = wifiDjelfaItemLoader(item=webCrawlerItem(), response=response)
        loader.add_css("name", "h1.product_title::text")
        loader.add_value("link", response.url)
        loader.add_css("price", "p.price bdi::text")
        loader.add_css("image_url", "img.wp-post-image::attr(data-src)")
        loader.add_value("category", "idk man")
        loader.add_value("base_url", self.base_url)
        loader.add_value("id_source", self.id_source)
        yield loader.load_item()
