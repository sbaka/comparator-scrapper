from scrapy.spiders import SitemapSpider
from scrapy import Request

from webcrawler.itemloaders import WebcrawlerItemLoader
from webcrawler.items import WebcrawlerItem

class wifiDjelfaSpider(SitemapSpider):
    name = "wifiDjelfa"
    source_name = "wifi djelfa"
    base_url = "https://wifidjelfa.com/"
    id_source = 2
    allowed_domains = ["wifidjelfa.com/"]
    sitemap_urls = ["https://wifidjelfa.com/robots.txt"]
    sitemap_rules = [
         (".*", "parse_product"),
     ]
    sitemap_follow = ["product-sitemap"]
    #start_urls = ["https://wifidjelfa.com/product/geforce-rtx-3070-8gb-gigabyte-gaming-oc-8gb-new/"]


    def parse_product(self, response):
        loader = WebcrawlerItemLoader(item=WebcrawlerItem(), response=response)
        loader.add_css("name", "h1.product_title::text")
        loader.add_value("link", response.url)
        loader.add_css("price", "p.price bdi::text")
        loader.add_css("image_url", ".woocommerce-product-gallery img::attr(src)")
        loader.add_css("category", "nav.wd-breadcrumbs a:nth-of-type(3)::text")
        loader.add_value("base_url", self.base_url)
        loader.add_value("id_source", self.id_source)
        yield loader.load_item()
