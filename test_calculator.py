import asyncio
from playwright.async_api import async_playwright
from pathlib import Path

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page(
            record_video_dir=".",
            record_video_size={"width": 640, "height": 480}
        )

        # Get the absolute path to the index.html file
        html_file_path = f"file://{Path('index.html').resolve()}"
        await page.goto(html_file_path)

        # Perform a calculation with delays
        await asyncio.sleep(2)
        await page.click('button:has-text("7")')
        await asyncio.sleep(1)
        await page.click('button:has-text("×")')
        await asyncio.sleep(1)
        await page.click('button:has-text("6")')
        await asyncio.sleep(1)
        await page.click('button:has-text("=")')
        await asyncio.sleep(2)

        # Assert the result
        result = await page.inner_text('.result')
        assert result == "42"

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
