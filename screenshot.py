import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        # Get the absolute path to the HTML file
        html_file_path = os.path.abspath('index.html')
        await page.goto(f'file://{html_file_path}')
        await page.screenshot(path='screenshot.png')
        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
