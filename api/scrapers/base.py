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
        ...
    @property
    @abstractmethod
    def base_url(self) -> str:
        ...
    @abstractmethod
    async def scrape(self, product_name: str) -> list[ProductResult]:
        ...
