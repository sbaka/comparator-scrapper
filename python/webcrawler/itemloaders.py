from scrapy.loader import ItemLoader
from itemloaders.processors import MapCompose, TakeFirst


def clean_price_click(value):
    """Remove spaces and convert price to float: '21 900' -> 21900.0"""
    return float(value.replace(' ', '').strip())

def clean_price_ssj(value):
    """Remove DA, replace comma, strip spaces: '11,990 DA' -> 11990.0"""
    return float(value.replace('DA', '').replace(',', '').strip())

def add_https_ssj(url):
    if url and url.startswith("//"):
        return "https:" + url
    return url

class clickInfoItemLoader(ItemLoader):
    default_output_processor = TakeFirst()

    name_in = MapCompose(str.strip)
    
    price_in = MapCompose(clean_price_click)
    
    image_url_in = MapCompose(str.strip)

    category_in = MapCompose(str.strip)

    id_source_in = MapCompose()


class ssjStoreItemLoader(ItemLoader):
    default_output_processor = TakeFirst()

    name_in = MapCompose(str.strip)
    
    price_in = MapCompose(clean_price_ssj)
    
    image_url_in = MapCompose(add_https_ssj)

    category_in = MapCompose(str.strip)

    id_source_in = MapCompose()

class wifiDjelfaItemLoader(ItemLoader):
    default_output_processor = TakeFirst()

    name_in = MapCompose(str.strip)
    
    price_in = MapCompose(str.strip)
    
    image_url_in = MapCompose(str.strip)

    category_in = MapCompose(str.strip)

    id_source_in = MapCompose()