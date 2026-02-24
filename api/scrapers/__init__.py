from .gamingsetif import GamingsetifScrapper
from .licbplus import LicbScraper
from .informaticsdz import InformaticsdzScraper

SCRAPERS = [
    LicbScraper(),
    InformaticsdzScraper(),
    GamingsetifScrapper()

]
