import sys
import json
import asyncio
import base64
import argparse
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError

async def scrape(url, headless=True, timeout=30000):
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=headless)
            page = await browser.new_page()
            try:
                await page.goto(url, wait_until='networkidle', timeout=timeout)
            except PlaywrightTimeoutError:
                await page.goto(url, wait_until='domcontentloaded', timeout=timeout)
            
            screenshot_bytes = await page.screenshot()
            dom = await page.content()
            title = await page.title()
            url_final = page.url
            await browser.close()
            return {
                'screenshot_base64': base64.b64encode(screenshot_bytes).decode('utf-8'),
                'dom': dom,
                'title': title,
                'url': url_final,
                'error': None
            }
    except Exception as e:
        return {
            'screenshot_base64': None,
            'dom': None,
            'title': None,
            'url': None,
            'error': str(e)
        }

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('url')
    parser.add_argument('--headless', action='store_true', default=True)
    parser.add_argument('--no-headless', dest='headless', action='store_false')
    parser.add_argument('--timeout', type=int, default=30000)
    args = parser.parse_args()
    
    result = asyncio.run(scrape(args.url, headless=args.headless, timeout=args.timeout))
    # GARANTE QUE SÓ O JSON É IMPRESSO
    print(json.dumps(result))

if __name__ == '__main__':
    main()