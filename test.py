import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            record_video_dir=".",
            record_video_size={"width": 640, "height": 480}
        )
        page = await context.new_page()

        # Get the absolute path to the index.html file
        html_file_path = os.path.abspath('index.html')

        await page.goto(f'file://{html_file_path}')

        # Perform a calculation: 12 + 34
        await page.click('.btn-1', delay=500)
        await page.click('.btn-2', delay=500)
        await page.click('.btn-add', delay=500)
        await page.click('.btn-3', delay=500)
        await page.click('.btn-4', delay=500)
        await page.click('.btn-equals', delay=1000)

        # Wait to ensure the video captures the result
        await page.wait_for_timeout(2000)

        await context.close()
        await browser.close()

        # Rename the video file
        video_path = await page.video.path()
        os.rename(video_path, "calculator_test.webm")


if __name__ == '__main__':
    asyncio.run(main())
