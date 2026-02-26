from ..base import BaseScraper, ProductResult
from bs4 import BeautifulSoup
import requests
from itertools import count

class MaxframeScraper(BaseScraper):
    @property
    def source_name(self) -> str:
        return "maxframe"
    @property
    def base_url(self) -> str:
        return "https://www.maxframe.dz/search/query?s={query}"
                
    async def scrape(self, product_name: str) -> list[ProductResult]:
        scraped_products = []
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36"}
        url = self.base_url.format(query=product_name)
        page = requests.get(url, headers=headers)
        soup = BeautifulSoup(page.content, "html.parser")
        results = soup.find("div", class_="articles")
        products = results.find_all("div", class_="article") if results else []
        print('im in maxframe ', len(products))
        for product in products:
            price_div = product.find("span", class_="price")
            price = price_div.get_text(strip=True) if price_div else "N/A"
            if price == 'N/A':
                    continue
            title = product.find("span", class_="t")
            name = title.get_text(strip=True) if title else "N/A"
            a_tag = product.find("a")
            link = a_tag["href"] if a_tag and a_tag.has_attr("href") else "N/A"
                
            img_tag = a_tag.find("img") if a_tag else None
            img_url = img_tag["src"] if img_tag and img_tag.has_attr("src") else "N/A"
            scraped_products.append(
                ProductResult(
                    name=name,
                    price=price,
                    link=link,
                    image_url=img_url,
                    source=self.source_name
                )
            )
        return scraped_products
