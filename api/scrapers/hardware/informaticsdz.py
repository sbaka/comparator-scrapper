from ..base import BaseScraper, ProductResult
from bs4 import BeautifulSoup
import requests
from itertools import count

class InformaticsdzScraper(BaseScraper):
    @property
    def source_name(self) -> str:
        return "informatics-dz"
    @property
    def base_url(self) -> str:
        return "https://informatics-dz.com/page/{page}/?s={query}&post_type=product&stock_status=instock"

    async def scrape(self, product_name: str) -> list[ProductResult]:
        scraped_products = []
        for page_num in count(1):
            url = self.base_url.format(query=product_name, page=page_num)
            page = requests.get(url)
            soup = BeautifulSoup(page.content, "html.parser")
            print(f'im in informatics-dz page {page_num}')
            results = soup.find("div", class_="products wd-products wd-grid-g grid-columns-3 elements-grid pagination-pagination")
            products = results.find_all("div", class_="product-wrapper") if results else []
            if not products:
                break
            for product in products:
                price_div = product.find("bdi")
                price = price_div.get_text(strip=True) if price_div else "N/A"
                if price == 'N/A':
                    continue
                h3 = product.find("h3", class_="wd-entities-title")
                a_tag = h3.find("a") if h3 else None
                if a_tag:
                    for span in a_tag.find_all("span"):
                        span.extract()
                    name = a_tag.get_text(strip=True)
                else:
                    name = h3.get_text(strip=True) if h3 else "N/A"
                link = a_tag["href"] if a_tag and a_tag.has_attr("href") else "N/A"
                img_wrap = product.find("a", class_="product-image-link")
                img_tag = img_wrap.find("img", class_="attachment-woocommerce_thumbnail") if img_wrap else None
                img_url = img_tag["data-src"] if img_tag and img_tag.has_attr("src") else "N/A"
                scraped_products.append(
                    ProductResult(
                        name=name,
                        price=price,
                        link=link,
                        image_url=img_url,
                        source=self.source_name
                    )
                )
            next_page_link = soup.find("a", class_="next page-numbers")
            if not next_page_link:
                break
        return scraped_products
