import asyncio
import os
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # Create a new context with video recording enabled.
        context = await browser.new_context(
            record_video_dir=".",
            record_video_size={"width": 640, "height": 480}
        )
        page = await context.new_page()

        # Navigate to the local HTML file.
        await page.goto(f'file://{os.getcwd()}/index.html')

        # Perform the calculation with pauses.
        await page.click('button:text("5")')
        await page.wait_for_timeout(1000)  # 1 second pause

        await page.click('button:text("+")')
        await page.wait_for_timeout(1000)

        await page.click('button:text("3")')
        await page.wait_for_timeout(1000)

        await page.click('button:text("=")')
        await page.wait_for_timeout(2000) # 2 second pause to see result

        # Close the context to save the video.
        await context.close()
        await browser.close()

        # Rename the video file
        video_path = await page.video.path()
        os.rename(video_path, "calculator_demo.webm")


if __name__ == '__main__':
    asyncio.run(main())
