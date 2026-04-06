from scrapy.spiders import SitemapSpider

from webcrawler.itemloaders import dracheshopItemLoader
from webcrawler.items import webCrawlerItem


class dracheShopSpider(SitemapSpider):
    name = "dracheShop"
    source_name = "drache shop"
    base_url = "https://drache-shop.com/"
    id_source = 5
    allowed_domains = ["drache-shop.com"]
    sitemap_urls = ["https://drache-shop.com/wp-sitemap-posts-product-1.xml"]
    sitemap_rules = [
        ("/produit/", "parse_product"),
    ]
    sitemap_follow = ["wp-sitemap-posts-product"]

    def parse_product(self, response):
        # Skip if out of stock
        if response.css("p.stock.out-of-stock"):
            return
        loader = dracheshopItemLoader(item=webCrawlerItem(), response=response)
        loader.add_css("name", "h1.product_title::text")
        loader.add_value("link", response.url)
        loader.add_css("price", "p.price ins .woocommerce-Price-amount bdi::text")
        loader.add_css("price", "p.price > .woocommerce-Price-amount bdi::text") 
        loader.add_css("image_url", ".woocommerce-product-gallery__image a::attr(href)")
        loader.add_value("category", "idk man")
        loader.add_value("base_url", self.base_url)
        loader.add_value("id_source", self.id_source)
        yield loader.load_item()
