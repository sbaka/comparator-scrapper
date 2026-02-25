from ..base import BaseScraper, ProductResult
from bs4 import BeautifulSoup
from itertools import count
import requests

class LicbScraper(BaseScraper):
    @property
    def source_name(self) -> str:
        return "licbplus"
    @property
    def base_url(self) -> str:
        return "https://licbplus.com.dz/search?search_term={query}&page={page}"

    async def scrape(self, product_name: str) -> list[ProductResult]:
        scraped_products = []
        for page_num in count(1):
            page = requests.get(self.base_url.format(query=product_name, page=page_num))
            soup = BeautifulSoup(page.content, "html.parser")
            results = soup.find("div", class_="row product-grid")
            print(f'im in licbplus page {page_num}')
            products = results.find_all("div", class_="product-cart-wrap") if results else []
            if not products:
                break
            for product in products:
                price_div = product.find("div", class_="product-price")
                price = price_div.find("span").get_text(strip=True) if price_div and price_div.find("span") else "N/A"
                if price == 'N/A':
                    continue
                h2 = product.find("h2", class_="mt-1")
                a_tag = h2.find("a") if h2 else None
                if a_tag:
                    for span in a_tag.find_all("span"):
                        span.extract()
                    name = a_tag.get_text(strip=True)
                else:
                    name = h2.get_text(strip=True) if h2 else "N/A"
                link = a_tag["href"] if a_tag and a_tag.has_attr("href") else "N/A"
                img_wrap = product.find("div", class_="product-img")
                img_tag = img_wrap.find("img") if img_wrap else None
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
            next_page_link = soup.find("a", rel="next")
            if not next_page_link:
                break
        return scraped_products
