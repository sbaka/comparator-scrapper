from scrapy.loader import ItemLoader
from itemloaders.processors import MapCompose, TakeFirst


def clean_price(value):
    """Convert price string to float: '21 900' / '118,900.00' / '11,990 DA' -> float"""
    return float(value.replace('DA', '').replace(' ', '').replace(',', '').strip())

def add_https_ssj(url):
    if url and url.startswith("//"):
        return "https:" + url
    return url

class clickInfoItemLoader(ItemLoader):
    default_output_processor = TakeFirst()

    name_in = MapCompose(str.strip)
    
    price_in = MapCompose(clean_price)
    
    image_url_in = MapCompose(str.strip)

    category_in = MapCompose(str.strip)

    id_source_in = MapCompose()


class ssjStoreItemLoader(ItemLoader):
    default_output_processor = TakeFirst()

    name_in = MapCompose(str.strip)
    
    price_in = MapCompose(clean_price)
    
    image_url_in = MapCompose(add_https_ssj)

    category_in = MapCompose(str.strip)

    id_source_in = MapCompose()

class wifiDjelfaItemLoader(ItemLoader):
    default_output_processor = TakeFirst()

    name_in = MapCompose(str.strip)
    
    price_in = MapCompose(clean_price)
    
    image_url_in = MapCompose(str.strip)

    category_in = MapCompose(str.strip)

    id_source_in = MapCompose()

class maxFrameItemLoader(ItemLoader):
    default_output_processor = TakeFirst()

    name_in = MapCompose(str.strip)
    
    price_in = MapCompose(clean_price)
    
    image_url_in = MapCompose(str.strip)

    category_in = MapCompose(str.strip)

    id_source_in = MapCompose()