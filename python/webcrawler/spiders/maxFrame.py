from scrapy.spiders import SitemapSpider

from webcrawler.itemloaders import maxFrameItemLoader
from webcrawler.items import webCrawlerItem

class maxFrameSpider(SitemapSpider):
    name = "maxFrame"
    source_name = "max frame"
    base_url = "https://maxframe.dz/"
    id_source = 4
    allowed_domains = ["maxframe.dz"]
    # MaxFrame intermittently breaks chunked responses with curl_cffi/impersonate.
    # Use Scrapy's native HTTP handler for this spider only.
    custom_settings = {
        "DOWNLOAD_HANDLERS": {
            "http": "scrapy.core.downloader.handlers.http.HTTPDownloadHandler",
            "https": "scrapy.core.downloader.handlers.http.HTTPDownloadHandler",
        },
        "DOWNLOADER_MIDDLEWARES": {
            "scrapy_impersonate.RandomBrowserMiddleware": None,
        },
        "USER_AGENT": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "ROBOTSTXT_OBEY": False,
    }
    sitemap_urls = ["https://www.maxframe.dz/sitemap/article.xml"]
    sitemap_rules = [
         ("/", "parse_product"),
     ]
    sitemap_follow = ["article"]

    def parse_product(self, response):
        # Skip if out of stock
        if response.css("div.ar-cont p.rem"):
            return
        loader = maxFrameItemLoader(item=webCrawlerItem(), response=response)
        loader.add_css("name", "div.ar-cont h1::text")
        loader.add_value("link", response.url)
        # Take sale price if exists, otherwise take regular price
        loader.add_css("price", "div.ar-cont span.price::text")
        loader.add_css("image_url", "img::attr(src)")
        loader.add_value("category", "idk man")
        loader.add_value("base_url", self.base_url)
        loader.add_value("id_source", self.id_source)
        yield loader.load_item()