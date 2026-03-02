from scrapy.spiders import SitemapSpider

from comparator_scrapper.items import ComparatorScrapperItem
from comparator_scrapper.itemloaders import ComparatorScrapperItemLoader


class ClickinfoSpider(SitemapSpider):
    name = "clickInfo"
    allowed_domains = ["click-dz.com"]
    sitemap_urls = ["https://click-dz.com/robots.txt"]
    sitemap_rules = [
        (".*", "parse_product"),
    ]
    sitemap_follow = ["product-sitemap"]

    def parse_product(self, response):
        loader = ComparatorScrapperItemLoader(item=ComparatorScrapperItem(), response=response)
        loader.add_css("name", "h1.product_title::text")
        loader.add_value("link", response.url)
        loader.add_css("price", "p.price bdi::text")
        loader.add_css("image_url", ".woocommerce-product-gallery img::attr(src)")
        yield loader.load_item()
