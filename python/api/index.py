from fastapi import FastAPI, BackgroundTasks
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from python.webcrawler.spiders.clickInfo import ClickinfoSpider

app = FastAPI(docs_url="/api/py/docs")


def run_spider():
    # Use standard Scrapy project settings
    settings = get_project_settings()
    # Use CrawlerProcess which manages the Twisted reactor
    process = CrawlerProcess(settings)
    process.crawl(ClickinfoSpider)
    process.start() # the script blocks here until the crawl is finished

@app.post("/crawl")
async def start_crawl(background_tasks: BackgroundTasks):
    # Add the Scrapy crawl function to background tasks
    background_tasks.add_task(run_spider)
    return {"message": "Scraping started in the background!"}