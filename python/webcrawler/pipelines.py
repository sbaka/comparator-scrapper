# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
import os
from itemadapter import ItemAdapter
from scrapy.exceptions import DropItem
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()



class WebcrawlerPipeline:
    def process_item(self, item):
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

    def process_item(self, item):
        adapter = ItemAdapter(item)
        link = adapter.get('link')
        if link in self.seen_links:
            raise DropItem(f"Duplicate item found: {item}")
        else:
            self.seen_links.add(link)
            return item
        

class SavingToSupabasePipeline(object):
    def __init__(self):
        self.create_connection()

    def process_item(self, item):
        self.save_to_supabase(item)
        return item
    def create_connection(self):
        # Here you would add code to create a connection to Supabase
        self.connection = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_PUBLISHABLE_KEY"))
        
        
    def save_to_supabase(self, item):
        # Here you would add code to save the item to Supabase
        link_product = item['link']
        name_product = item['name']
        price_product = item['price']
        img_product= item['image_url']
        product_data= { 'name_product': name_product,'img_product': img_product, 'price_product': price_product, 'link_product':link_product,}
        print(product_data)
        response = self.connection.table('product').insert(product_data).execute()
        print('dkhlna l pipeline', response)
        