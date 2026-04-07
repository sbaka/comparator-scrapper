# Define here the models for your spider middleware
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/spider-middleware.html

from scrapy import signals
from scrapy.http import HtmlResponse
from twisted.internet.threads import deferToThread

try:
    import cloudscraper  # type: ignore[import-not-found]
except ImportError:  # pragma: no cover - optional dependency
    cloudscraper = None

# useful for handling different item types with a single interface
from itemadapter import ItemAdapter


class WebcrawlerSpiderMiddleware:
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the spider middleware does not modify the
    # passed objects.

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_spider_input(self, response, spider):
        # Called for each response that goes through the spider
        # middleware and into the spider.

        # Should return None or raise an exception.
        return None

    def process_spider_output(self, response, result, spider):
        # Called with the results returned from the Spider, after
        # it has processed the response.

        # Must return an iterable of Request, or item objects.
        for i in result:
            yield i

    def process_spider_exception(self, response, exception, spider):
        # Called when a spider or process_spider_input() method
        # (from other spider middleware) raises an exception.

        # Should return either None or an iterable of Request or item objects.
        pass

    async def process_start(self, start):
        # Called with an async iterator over the spider start() method or the
        # maching method of an earlier spider middleware.
        async for item_or_request in start:
            yield item_or_request

    def spider_opened(self, spider):
        spider.logger.info("Spider opened: %s" % spider.name)


class WebcrawlerDownloaderMiddleware:
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the downloader middleware does not modify the
    # passed objects.

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_request(self, request, spider):
        # Called for each request that goes through the downloader
        # middleware.

        # Must either:
        # - return None: continue processing this request
        # - or return a Response object
        # - or return a Request object
        # - or raise IgnoreRequest: process_exception() methods of
        #   installed downloader middleware will be called
        return None

    def process_response(self, request, response, spider):
        # Called with the response returned from the downloader.

        # Must either;
        # - return a Response object
        # - return a Request object
        # - or raise IgnoreRequest
        return response

    def process_exception(self, request, exception, spider):
        # Called when a download handler or a process_request()
        # (from other downloader middleware) raises an exception.

        # Must either:
        # - return None: continue processing this exception
        # - return a Response object: stops process_exception() chain
        # - return a Request object: stops process_exception() chain
        pass

    def spider_opened(self, spider):
        spider.logger.info("Spider opened: %s" % spider.name)


class CloudscraperFallbackMiddleware:
    """Optional fallback that retries blocked pages with Cloudscraper.

    Enable globally with CLOUDSCRAPER_ENABLED, or per-request by setting
    request.meta["use_cloudscraper"] = True.
    """

    def __init__(self, enabled, retry_http_codes, timeout, browser_profile):
        self.enabled = enabled
        self.retry_http_codes = {int(code) for code in retry_http_codes}
        self.timeout = timeout
        self.browser_profile = browser_profile

    @classmethod
    def from_crawler(cls, crawler):
        settings = crawler.settings
        return cls(
            enabled=settings.getbool("CLOUDSCRAPER_ENABLED", False),
            retry_http_codes=settings.getlist("CLOUDSCRAPER_RETRY_HTTP_CODES", [403, 429, 503]),
            timeout=settings.getfloat("CLOUDSCRAPER_TIMEOUT", 30),
            browser_profile=settings.getdict(
                "CLOUDSCRAPER_BROWSER",
                {"browser": "chrome", "platform": "windows", "mobile": False},
            ),
        )

    def process_response(self, request, response, spider):
        if not self.enabled and not request.meta.get("use_cloudscraper", False):
            return response

        if cloudscraper is None:
            spider.logger.warning(
                "Cloudscraper fallback requested but cloudscraper is not installed."
            )
            return response

        if not request.meta.get("use_cloudscraper", False) and response.status not in self.retry_http_codes:
            return response

        return deferToThread(self._fetch_with_cloudscraper, request, response, spider)

    def _fetch_with_cloudscraper(self, request, original_response, spider):
        try:
            scraper = cloudscraper.create_scraper(browser=self.browser_profile)
            headers = request.headers.to_unicode_dict()
            data = request.body if request.body else None

            cloud_response = scraper.request(
                method=request.method,
                url=request.url,
                headers=headers,
                data=data,
                timeout=self.timeout,
                allow_redirects=True,
            )

            return HtmlResponse(
                url=cloud_response.url or request.url,
                status=cloud_response.status_code,
                headers=dict(cloud_response.headers),
                body=cloud_response.content,
                encoding=cloud_response.encoding or "utf-8",
                request=request,
            )
        except Exception as exc:  # pragma: no cover - network dependent
            spider.logger.warning("Cloudscraper fallback failed: %s", exc)
            return original_response
