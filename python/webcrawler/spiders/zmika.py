from scrapy import Request
from scrapy.spiders import SitemapSpider
from webcrawler.itemloaders import zmikaItemLoader
from webcrawler.items import webCrawlerItem


class zmikaSpider(SitemapSpider):
    name = "zmika"
    source_name = "zmika"
    base_url = "https://zmika.com"
    id_source = 8
    allowed_domains = ["zmika.com"]
    sitemap_urls = ["https://zmika.com/sitemap.txt"]
    sitemap_rules = [
        ("/products/", "parse_product"),
    ]

    def _parse_sitemap(self, response):
        for url in response.text.splitlines():
            url = url.strip()
            for r, c in self._cbs:
                if r.search(url):
                    yield Request(url, callback=c)
                    break

    def parse_product(self, response):
        if "out of stock" in response.text.lower():
            return

        loader = zmikaItemLoader(item=webCrawlerItem(), response=response)
        loader.add_css("name", "h1::text")
        loader.add_value("link", response.url)
        loader.add_css("price", "h3.font-bold::text")
        image_url = response.css("img[alt='product']::attr(src)").get()
        if image_url:
            loader.add_value("image_url", response.urljoin(image_url))
        loader.add_value("category", "idk man")
        loader.add_value("base_url", self.base_url)
        loader.add_value("id_source", self.id_source)
        yield loader.load_item()