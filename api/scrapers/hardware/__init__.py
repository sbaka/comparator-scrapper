
from .maxframe import MaxframeScraper
from .dracheshop import DracheshopScraper
from .clickinfo import ClickinfoScraper
from .gamingsetif import GamingsetifScrapper
from .licbplus import LicbScraper
from .informaticsdz import InformaticsdzScraper

SCRAPERS = [
	ClickinfoScraper(),
    #MaxframeScraper(),
    DracheshopScraper(),
	LicbScraper(),
	InformaticsdzScraper(),
	#GamingsetifScrapper(),
]
