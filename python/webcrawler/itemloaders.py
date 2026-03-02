from scrapy.loader import ItemLoader
from itemloaders.processors import MapCompose, TakeFirst


class WebcrawlerItemLoader(ItemLoader):
    default_output_processor = TakeFirst()

    name_in = MapCompose(str.strip)
    
    price_in = MapCompose(str.strip)
    
    image_url_in = MapCompose(str.strip)