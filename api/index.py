
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Any
import asyncio
from .scrapers import SCRAPERS

app = FastAPI(docs_url="/api/py/docs")


class ProductResultModel(BaseModel):
    name: str
    price: str
    link: str
    image_url: str
    source: str

@app.get("/api/py/products", response_model=dict)
async def list_products(query: str = None):
    if not query:
        raise HTTPException(status_code=400, detail="Query parameter 'query' is required.")

    # Run all scrapers concurrently
    tasks = [scraper.scrape(query) for scraper in SCRAPERS]
    results_nested = await asyncio.gather(*tasks)
    # Flatten results
    results = [item for sublist in results_nested for item in sublist]
    # Convert to dicts for JSON serialization
    results_dicts = [ProductResultModel(**vars(r)).dict() for r in results]
    # Sort by price ascending
    results_dicts.sort(key=lambda x: x['price'])
    return {"product": query, "results": results_dicts}