from scrapy.spiders import SitemapSpider
from webcrawler.itemloaders import informaticsDzItemLoader
from webcrawler.items import webCrawlerItem

class informaticsDzSpider(SitemapSpider):
    name = "informaticsDz"
    source_name = "informatics dz"
    base_url = "https://informatics-dz.com/"
    id_source = 9
    allowed_domains = ["informatics-dz.com"]
    sitemap_urls = ["https://informatics-dz.com/robots.txt"]
    sitemap_rules = [
         ("/product/", "parse_product"),
     ]
    sitemap_follow = ["product-sitemap"]
    #start_urls = ["https://click-dz.com/ryzen-3-4100-4-coeurs-8-threads-3-8-ghz-8mo-cache-65w-vega-6-box/"]


    def parse_product(self, response):
        # Skip if out of stock
        if response.css(".stock.out-of-stock"):
            return
        loader = informaticsDzItemLoader(item=webCrawlerItem(), response=response)
        loader.add_css("name", "h1.product_title::text")
        loader.add_value("link", response.url)
        loader.add_css("price", "p.price bdi::text")
        loader.add_css("image_url", ".woocommerce-product-gallery img::attr(src)")
        loader.add_css("category", "nav.wd-breadcrumbs a:nth-of-type(3)::text")
        loader.add_value("base_url", self.base_url)
        loader.add_value("id_source", self.id_source)
        yield loader.load_item()
