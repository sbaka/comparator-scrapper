from fastapi import FastAPI, HTTPException
from scrapy.utils.project import get_project_settings
from scrapy.crawler import CrawlerProcess

from python.webcrawler.spiders.clickInfo import ClickinfoSpider

app = FastAPI(
    title="Comparator Scraper API",
    version="0.1.0",
    docs_url="/api/py/docs",
)

@app.get("/crawl")
async def crawl():
    settings = get_project_settings()
    runner = CrawlerProcess(settings)
    runner.crawl(ClickinfoSpider)
    runner.start()