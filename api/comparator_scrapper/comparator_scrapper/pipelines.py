# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
from scrapy.exceptions import DropItem

class ComparatorScrapperPipeline:
    def process_item(self, item, spider):
        return item


"""
class PriceConverterPipeline:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        price = adapter.get('price')
        if price:
            adapter['price'] = float(price)
            return item
        else:
            raise DropItem(f"Missing price in {item}")
"""

class duplicatesPipeline:
    def __init__(self):
        self.seen_links = set()

    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        link = adapter.get('link')
        if link in self.seen_links:
            raise DropItem(f"Duplicate item found: {item}")
        else:
            self.seen_links.add(link)
            return item