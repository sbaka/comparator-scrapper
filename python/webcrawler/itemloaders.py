from scrapy.loader import ItemLoader
from itemloaders.processors import MapCompose, TakeFirst


def clean_price(value):
    """Remove spaces and convert price to float: '21 900' -> 21900.0"""
    return float(value.replace(' ', '').strip())


class WebcrawlerItemLoader(ItemLoader):
    default_output_processor = TakeFirst()

    name_in = MapCompose(str.strip)
    
    price_in = MapCompose(clean_price)
    
    image_url_in = MapCompose(str.strip)
    
    name_source_in = MapCompose(str.strip)
