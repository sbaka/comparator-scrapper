from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class ProductResult:
    """Standardized product result returned by every scraper."""
    name: str
    price: float
    link: str
    image_url: str
    source: str  # e.g. "amazon", "ebay"


class BaseScraper(ABC):
    """
    Abstract base class for all site scrapers.
    Each website scraper must inherit from this and implement `scrape()`.
    """

    @property
    @abstractmethod
    def source_name(self) -> str:
        """Return the name of the source website (e.g. 'amazon')."""
        ...

    @property
    @abstractmethod
    def base_url(self) -> str:
        """Return the base URL of the source website."""
        ...


    @abstractmethod
    async def scrape(self, product_name: str) -> list[ProductResult]:
        """
        Search for a product on the website and return a list of results.

        Args:
            product_name: The product to search for (e.g. "iPhone 15").

        Returns:
            A list of ProductResult with name, price, link, and source.
        """
        ...
