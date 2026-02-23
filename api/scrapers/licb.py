from .base import BaseScraper, ProductResult
from bs4 import BeautifulSoup
import requests

class LICBScraper(BaseScraper):
    @property
    def source_name(self) -> str:
        return "licb"
    @property
    def base_url(self) -> str:
        return "https://www.licb.com/search?q={query}"

    async def scrape(self, product_name: str) -> list[ProductResult]:
        page = requests.get(self.base_url.format(query=product_name))
        print(page)

