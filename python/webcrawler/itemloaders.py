import re

from scrapy.loader import ItemLoader
from itemloaders.processors import MapCompose, TakeFirst


def clean_price(value):
    """Convert price string to float:
    '21 900' / '118,900.00' / '11,990 DA' / '12.500,00' -> float"""
    if isinstance(value, (int, float)):
        return float(value)
    value = re.sub(r'[^\d,\.]', '', value)
    if ',' in value and '.' in value and value.index('.') < value.index(','):
        value = value.replace('.', '').replace(',', '.')
    else:
        value = value.replace(',', '')
    return float(value)

def normalize_image_url(url):
    if not url:
        return url
    if url.startswith("//"):
        url = "https:" + url
    return url.split("?")[0]

class informaticsDzItemLoader(ItemLoader):
    default_output_processor = TakeFirst()
    name_in = MapCompose(str.strip)
    price_in = MapCompose(clean_price)
    image_url_in = MapCompose(str.strip)
    category_in = MapCompose(str.strip)
    id_source_in = MapCompose()

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
    image_url_in = MapCompose(normalize_image_url)
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


class dracheshopItemLoader(ItemLoader):
    default_output_processor = TakeFirst()
    name_in = MapCompose(str.strip)
    price_in = MapCompose(clean_price)
    image_url_in = MapCompose(str.strip)
    category_in = MapCompose(str.strip)
    id_source_in = MapCompose()


class gentechxItemLoader(ItemLoader):
    default_output_processor = TakeFirst()
    name_in = MapCompose(str.strip)
    price_in = MapCompose(clean_price)
    image_url_in = MapCompose(normalize_image_url)
    category_in = MapCompose(str.strip)
    id_source_in = MapCompose()


class itechstoreItemLoader(ItemLoader):
    default_output_processor = TakeFirst()
    name_in = MapCompose(str.strip)
    price_in = MapCompose(clean_price)
    image_url_in = MapCompose(str.strip)
    category_in = MapCompose(str.strip)
    id_source_in = MapCompose()


class zmikaItemLoader(ItemLoader):
    default_output_processor = TakeFirst()
    name_in = MapCompose(str.strip)
    price_in = MapCompose(clean_price)
    image_url_in = MapCompose(str.strip)
    category_in = MapCompose(str.strip)
    id_source_in = MapCompose()