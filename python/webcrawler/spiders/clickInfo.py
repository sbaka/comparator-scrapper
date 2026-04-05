from scrapy.spiders import SitemapSpider
from webcrawler.itemloaders import clickInfoItemLoader
from webcrawler.items import webCrawlerItem

class clickInfoSpider(SitemapSpider):
    name = "clickInfo"
    source_name = "click informatique"
    base_url = "https://click-dz.com/"
    id_source = 1
    allowed_domains = ["click-dz.com"]
    sitemap_urls = ["https://click-dz.com/robots.txt"]
    sitemap_rules = [
         (".*", "parse_product"),
     ]
    sitemap_follow = ["product-sitemap"]
    #start_urls = ["https://click-dz.com/ryzen-3-4100-4-coeurs-8-threads-3-8-ghz-8mo-cache-65w-vega-6-box/"]


    def parse_product(self, response):
        # Skip if out of stock
        if response.css(".stock.out-of-stock"):
            return
        loader = clickInfoItemLoader(item=webCrawlerItem(), response=response)
        loader.add_css("name", "h1.product_title::text")
        loader.add_value("link", response.url)
        loader.add_css("price", "p.price bdi::text")
        loader.add_css("image_url", ".woocommerce-product-gallery img::attr(src)")
        loader.add_css("category", "nav.wd-breadcrumbs a:nth-of-type(3)::text")
        loader.add_value("base_url", self.base_url)
        loader.add_value("id_source", self.id_source)
        yield loader.load_item()
