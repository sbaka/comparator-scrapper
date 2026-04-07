# Scrapy settings for webcrawler project
#
# For simplicity, this file contains only settings considered important or
# commonly used. You can find more settings consulting the documentation:
#
#     https://docs.scrapy.org/en/latest/topics/settings.html
#     https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
#     https://docs.scrapy.org/en/latest/topics/spider-middleware.html

BOT_NAME = "webcrawler"

SPIDER_MODULES = ["webcrawler.spiders"]
NEWSPIDER_MODULE = "webcrawler.spiders"

ADDONS = {}


# Crawl responsibly by identifying yourself (and your website) on the user-agent
USER_AGENT = ""

# Obey robots.txt rules
ROBOTSTXT_OBEY = False

# Concurrency and throttling settings
#CONCURRENT_REQUESTS = 16
CONCURRENT_REQUESTS_PER_DOMAIN = 1
DOWNLOAD_DELAY = 2
RANDOMIZE_DOWNLOAD_DELAY = True

# Disable cookies (enabled by default)
#COOKIES_ENABLED = False

# Disable Telnet Console (enabled by default)
#TELNETCONSOLE_ENABLED = False

# Let scrapy-impersonate/curl_cffi set a coherent browser header profile.
#DEFAULT_REQUEST_HEADERS = {
#    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
#    "Accept-Language": "en-US,en;q=0.9",
#    "Accept-Encoding": "gzip, deflate",
#    "Connection": "keep-alive",
#    "Upgrade-Insecure-Requests": "1",
#    "Sec-Fetch-Dest": "document",
#    "Sec-Fetch-Mode": "navigate",
#    "Sec-Fetch-Site": "none",
#    "Sec-Fetch-User": "?1",
#    "Cache-Control": "max-age=0",
#}

# Enable or disable spider middlewares
# See https://docs.scrapy.org/en/latest/topics/spider-middleware.html
#SPIDER_MIDDLEWARES = {
#    "webcrawler.middlewares.WebcrawlerSpiderMiddleware": 543,
#}

# Enable or disable downloader middlewares
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
DOWNLOADER_MIDDLEWARES = {
#    "webcrawler.middlewares.WebcrawlerDownloaderMiddleware": 543,
    "webcrawler.middlewares.CloudscraperFallbackMiddleware": 560,
    "scrapy_impersonate.RandomBrowserMiddleware": 1000,
}

DOWNLOAD_HANDLERS = {
    "http": "scrapy_impersonate.ImpersonateDownloadHandler",
    "https": "scrapy_impersonate.ImpersonateDownloadHandler",
}

TWISTED_REACTOR = "twisted.internet.asyncioreactor.AsyncioSelectorReactor"

RETRY_ENABLED = True
RETRY_TIMES = 3
RETRY_HTTP_CODES = [403, 408, 429, 500, 502, 503, 504, 522, 524]

# Cloudscraper fallback is disabled by default and can be enabled globally
# or per request via request.meta["use_cloudscraper"] = True.
CLOUDSCRAPER_ENABLED = True
CLOUDSCRAPER_RETRY_HTTP_CODES = [403, 429, 503]
CLOUDSCRAPER_TIMEOUT = 30
CLOUDSCRAPER_BROWSER = {
    "browser": "chrome",
    "platform": "windows",
    "mobile": False,
}

# Enable or disable extensions
# See https://docs.scrapy.org/en/latest/topics/extensions.html
#EXTENSIONS = {
#    "scrapy.extensions.telnet.TelnetConsole": None,
#}

# Configure item pipelines
# See https://docs.scrapy.org/en/latest/topics/item-pipeline.html
ITEM_PIPELINES = {
    "webcrawler.pipelines.ValidationPipeline": 300,
    "webcrawler.pipelines.duplicatesPipeline": 400,
    "webcrawler.pipelines.SavingToSupabasePipeline": 500,
   
}

# Enable and configure the AutoThrottle extension (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/autothrottle.html
AUTOTHROTTLE_ENABLED = True
# The initial download delay
AUTOTHROTTLE_START_DELAY = 2
# The maximum download delay to be set in case of high latencies
AUTOTHROTTLE_MAX_DELAY = 10
# The average number of requests Scrapy should be sending in parallel to
# each remote server
AUTOTHROTTLE_TARGET_CONCURRENCY = 1.0
# Enable showing throttling stats for every response received:
#AUTOTHROTTLE_DEBUG = False

# Enable and configure HTTP caching (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html#httpcache-middleware-settings
#HTTPCACHE_ENABLED = True
#HTTPCACHE_EXPIRATION_SECS = 0
#HTTPCACHE_DIR = "httpcache"
#HTTPCACHE_IGNORE_HTTP_CODES = []
#HTTPCACHE_STORAGE = "scrapy.extensions.httpcache.FilesystemCacheStorage"

# Set settings whose default value is deprecated to a future-proof value
FEED_EXPORT_ENCODING = "utf-8"

