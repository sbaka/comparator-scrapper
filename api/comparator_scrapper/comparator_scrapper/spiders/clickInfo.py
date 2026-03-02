from scrapy.spiders import SitemapSpider

from comparator_scrapper.items import ComparatorScrapperItem


class ClickinfoSpider(SitemapSpider):
    name = "clickInfo"
    allowed_domains = ["click-dz.com"]
    sitemap_urls = ["https://click-dz.com/robots.txt"]
    sitemap_rules = [
        (".*", "parse_product"),
    ]
    sitemap_follow = ["product-sitemap"]

    def parse_product(self, response):
        item = ComparatorScrapperItem()
        item["name"] = response.css("h1.product_title::text").get("").strip()
        item["link"] = response.url
        item["price"] = response.css("p.price bdi::text").get("").strip()
        item["image_url"] = response.css(
            ".woocommerce-product-gallery img::attr(src)"
        ).get("")
        yield item
