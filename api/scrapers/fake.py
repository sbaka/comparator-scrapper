from .base import BaseScraper, ProductResult

class FakeScraper(BaseScraper):
    @property
    def source_name(self) -> str:
        return "fake"

    async def scrape(self, product_name: str) -> list[ProductResult]:
        # Return fake data
        return [
            ProductResult(
                name=f"{product_name} - Fake Edition",
                price=123.45,
                link="https://fake.example.com/product",
                source=self.source_name
            ),
            ProductResult(
                name=f"{product_name} - Fake Pro",
                price=199.99,
                link="https://fake.example.com/product-pro",
                source=self.source_name
            )
        ]
