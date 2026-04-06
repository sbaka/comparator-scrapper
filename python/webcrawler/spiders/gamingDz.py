from scrapy.spiders import SitemapSpider
from webcrawler.itemloaders import gamingDzItemLoader
from webcrawler.items import webCrawlerItem

class gamingDzSpider(SitemapSpider):
    name = "gamingDz"
    source_name = "gaming dz"
    base_url = "https://www.gamingdz.com/"
    id_source = 1
    allowed_domains = ["gamingdz.com"]
    sitemap_urls = ["https://www.gamingdz.com/robots.txt"]
    sitemap_rules = [
         (".*", "parse_product"),
     ]
    sitemap_follow = ["product-sitemap"]
    #start_urls = ["https://click-dz.com/ryzen-3-4100-4-coeurs-8-threads-3-8-ghz-8mo-cache-65w-vega-6-box/"]


    def parse_product(self, response):
        # Check if out of stock
        if response.xpath("//span[@class='badge bg-danger' and contains(text(), 'Out Of Stock')]"):
            return
        loader = gamingDzItemLoader(item=webCrawlerItem(), response=response)
        loader.add_css("name", "h4.title-detail::text")
        loader.add_value("link", response.url)
        loader.add_css("price", "div.product-price span.text-brand::text")
        product_images = [img for img in response.css("img::attr(src)").getall() if 'storage' in img or 'product' in img.lower()]
        print(f"Extracted product images: {product_images}")
        loader.add_value("image_url", product_images[3].replace(" ", "%20"))
        loader.add_value("category", "mb3ad ngl3ouha")
        loader.add_value("base_url", self.base_url)
        loader.add_value("id_source", self.id_source)
        yield loader.load_item()
