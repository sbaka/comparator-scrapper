# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
import os
from itemadapter import ItemAdapter
from scrapy.exceptions import DropItem
from supabase import create_client
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
        self.connection = create_client(os.environ.get("NEXT_PUBLIC_SUPABASE_URL"), os.environ.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY"))
        self.source_cache = {}
    def process_item(self, item):
        self.save_to_supabase(item)
        return item

    def save_to_supabase(self, item):
        link_product = item['link']
        name_product = item['name']
        price_product = item['price']
        img_product = item['image_url']
        category_product = item['category']

        product_data = {'id_source': item['id_source'],'id_category': 2,'name_product': name_product, 'img_product': img_product, 'price_product': price_product, 'link_product': link_product}
        print(f"Product Data: {product_data}")
        # 2. Upsert product with source_id
        self.connection.table('product').insert(product_data).execute()
