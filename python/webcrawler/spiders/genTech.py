from scrapy.spiders import SitemapSpider

from webcrawler.itemloaders import gentechxItemLoader
from webcrawler.items import webCrawlerItem


class genTechxSpider(SitemapSpider):
    name = "genTechx"
    source_name = "gentechx"
    base_url = "https://gentechx.com/"
    id_source = 6
    allowed_domains = ["gentechx.com"]
    sitemap_urls = ["https://gentechx.com/robots.txt"]
    sitemap_rules = [
        ("/products/", "parse_product"),
    ]
    sitemap_follow = ["sitemap_products"]

    def parse_product(self, response):
        if response.css(".stock.out-of-stock, p.stock.out-of-stock, button.product-form__submit[disabled]"):
            return

        loader = gentechxItemLoader(item=webCrawlerItem(), response=response)
        loader.add_css("name", "h1.hdt-product__title.hdt-h3::text")
        loader.add_value("link", response.url)
        loader.add_css("price", "hdt-price .hdt-money::text")
        loader.add_css("price", "hdt-compare-at-price .hdt-money::text")
        loader.add_css("image_url", ".hdt-product__media img::attr(src)")
        loader.add_value("category", "idk man")
        loader.add_value("base_url", self.base_url)
        loader.add_value("id_source", self.id_source)
        yield loader.load_item()
