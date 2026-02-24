from .base import BaseScraper, ProductResult
from bs4 import BeautifulSoup
import requests

class InformaticsdzScraper(BaseScraper):
    @property
    def source_name(self) -> str:
        return "informatics-dz"
    @property
    def base_url(self) -> str:
        return "https://informatics-dz.com/?s={query}&post_type=product"

    async def scrape(self, product_name: str) -> list[ProductResult]:
        page = requests.get(self.base_url.format(query=product_name))
        soup = BeautifulSoup(page.content, "html.parser")
        print('im in informatics-dz')
        # Find the product grid
        results = soup.find("div", class_="products wd-products wd-grid-g grid-columns-3 elements-grid pagination-pagination")
        # Find all product cards inside the grid
        products = results.find_all("div", class_="product-wrapper") if results else []
        scraped_products = []
        for product in products:
            
            # Get the price from bdi tag
            price_div = product.find("bdi")
            price = price_div.get_text(strip=True) if price_div else "N/A"
            if (price=='N/A'):
                continue
            
            # Get the product name from h2.mt-1 > a, excluding <span> labels like 'New'
            h3 = product.find("h3", class_="wd-entities-title")
            a_tag = h3.find("a") if h3 else None
            if a_tag:
                # Remove all <span> tags (like 'New') from the <a> tag
                for span in a_tag.find_all("span"):
                    span.extract()
                name = a_tag.get_text(strip=True)
            else:
                name = h3.get_text(strip=True) if h3 else "N/A"
            link = a_tag["href"] if a_tag and a_tag.has_attr("href") else "N/A"

            # Get the image URL from .product-img > a > img
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

        return scraped_products





