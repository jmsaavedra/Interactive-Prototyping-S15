# -*- coding: utf-8 -*-
import scrapy


class RedditSpider(scrapy.Spider):
    name = "reddit"
    allowed_domains = ["reddit.com"]
    start_urls = (
        'http://www.reddit.com/r/gifs/controversial/',
    )

    def parse(self, response):
        for sel in response.xpath('//div'):
            title = sel.xpath('a/text()').extract()
            link = sel.xpath('a/@href').extract()
            desc = sel.xpath('text()').extract()
            print title, link, desc
