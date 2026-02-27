from ..base import BaseScraper, ProductResult
from bs4 import BeautifulSoup
import aiohttp
import asyncio

class LicbScraper(BaseScraper):
    @property
    def source_name(self) -> str:
        return "licbplus"

    @property
    def base_url(self) -> str:
        return "https://licbplus.com.dz/search?search_term={query}&page={page}"

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
            results = soup.find("div", class_="row product-grid")
            for product in results.find_all("div", class_="product-cart-wrap") if results else []:
                price_div = product.find("div", class_="product-price")
                price = price_div.find("span").get_text(strip=True) if price_div and price_div.find("span") else "N/A"
                if price == "N/A":
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
                img_url = img_tag.get("src", "N/A") if img_tag else "N/A"
                products.append(ProductResult(
                    name=name, price=price, link=link,
                    image_url=img_url, source=self.source_name
                ))
            return products

        async with aiohttp.ClientSession(headers=headers) as session:
            first_html = await fetch(session, self.base_url.format(query=product_name, page=1))
            first_soup = BeautifulSoup(first_html, "lxml")

            # Get total pages from pagination — grab all numeric page-link texts and take the max
            total_pages = 1
            pagination = first_soup.find("ul", class_="pagination")
            if pagination:
                for a in pagination.find_all("a", class_="page-link"):
                    text = a.get_text(strip=True)
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