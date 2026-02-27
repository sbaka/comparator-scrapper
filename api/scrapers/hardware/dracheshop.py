from ..base import BaseScraper, ProductResult
from bs4 import BeautifulSoup
import aiohttp
import asyncio

class DracheshopScraper(BaseScraper):
    @property
    def source_name(self) -> str:
        return "drache-shop"

    @property
    def base_url(self) -> str:
        return "https://drache-shop.com/shop/page/{page}/?per_page=24&s={query}&post_type=product&type_aws=true"

    async def scrape(self, product_name: str) -> list[ProductResult]:
        import time
        start = time.time()
        all_products = []

        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}


        async def fetch(session, url):
            async with session.get(url) as response:
                return await response.text()

        def parse(soup):
            products = []
            results = soup.find("div", class_="products wd-products wd-grid-g grid-columns-5 elements-grid pagination-pagination title-line-one wd-stretch-cont-lg wd-products-with-bg")
            for product in results.find_all("div", class_="wd-product") if results else []:
                price_div = product.find("span", class_="price")
                price = price_div.get_text(strip=True) if price_div else "N/A"
                if price == "N/A":
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
                img_wrap = product.find("div", class_="product-element-top wd-quick-shop")
                img_tag = img_wrap.find("img") if img_wrap else None
                img_url = img_tag.get("data-src", "N/A") if img_tag else "N/A"
                products.append(ProductResult(
                    name=name, price=price, link=link,
                    image_url=img_url, source=self.source_name
                ))
            return products

        async with aiohttp.ClientSession(headers=headers,) as session:
            first_html = await fetch(session, self.base_url.format(query=product_name, page=1))
            first_soup = BeautifulSoup(first_html, "lxml")

            total_pages = 1
            pagination = first_soup.find("ul", class_="page-numbers")
            if pagination:
                for item in pagination.find_all(["a", "span"], class_="page-numbers"):
                    text = item.get_text(strip=True)
                    if text.isdigit():
                        total_pages = max(total_pages, int(text))

            all_products.extend(parse(first_soup))

            if total_pages > 1:
                pages_html = await asyncio.gather(*[
                    fetch(session, self.base_url.format(query=product_name, page=p))
                    for p in range(2, total_pages + 1)
                ])
                for html in pages_html:
                    all_products.extend(parse(BeautifulSoup(html, "lxml")))

        print(f"Execution time: {time.time() - start:.2f}s | Products: {len(all_products)}")
        return all_products