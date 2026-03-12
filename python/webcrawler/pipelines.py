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


class ValidationPipeline:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        required_fields = ['name', 'price', 'link', 'image_url']
        for field in required_fields:
            if not adapter.get(field):
                raise DropItem(f"Missing '{field}' in {item}")
        return item

class ValidationPipeline:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        required_fields = ['name', 'price', 'link', 'image_url']
        for field in required_fields:
            if not adapter.get(field):
                raise DropItem(f"Missing '{field}' in {item}")
        return item

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
        self.connection = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_PUBLISHABLE_KEY"))
        self.source_cache = {}
    def process_item(self, item):
        self.save_to_supabase(item)
        return item

    def save_to_supabase(self, item):
        link_product = item['link']
        name_product = item['name']
        price_product = item['price']
        img_product = item['image_url']

        source_data= { 'link_source': item['base_url'],'name_source': item['name_source']}

        # 1. Upsert source and get its ID and cache it so we don't have to query the database again for the same source
        source_response = self.connection.table('source').upsert(
            source_data, on_conflict="name_source"
        ).execute()
        if item['name_source'] not in self.source_cache:
            source_response = self.connection.table('source').upsert(
                source_data, on_conflict="name_source"
            ).execute()
            self.source_cache[item['name_source']] = source_response.data[0]['id_source']

        product_data = {'id_source': self.source_cache[item['name_source']],'name_product': name_product, 'img_product': img_product, 'price_product': price_product, 'link_product': link_product}
        print(f"Product Data: {product_data}")
        # 2. Upsert product with source_id
        self.connection.table('product').insert(product_data).execute()
