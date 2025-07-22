import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(record_video_dir="videos/")
        page = await context.new_page()
        await page.goto("http://localhost:8000")
        await asyncio.sleep(1)

        # 7 * 6
        await page.click("text=7")
        await asyncio.sleep(1)
        await page.click("text=*")
        await asyncio.sleep(1)
        await page.click("text=6")
        await asyncio.sleep(1)
        await page.click("text==")
        await asyncio.sleep(1)
        await expect(page.locator("#result")).to_have_value("42")
        await asyncio.sleep(2)

        # Clear
        await page.click("text=C")
        await asyncio.sleep(1)

        # (10 + 5) / 3
        await page.click("text=(")
        await asyncio.sleep(1)
        await page.click("text=1")
        await asyncio.sleep(1)
        await page.click("text=0")
        await asyncio.sleep(1)
        await page.click("text=+")
        await asyncio.sleep(1)
        await page.click("text=5")
        await asyncio.sleep(1)
        await page.click("text=)")
        await asyncio.sleep(1)
        await page.click("text=/")
        await asyncio.sleep(1)
        await page.click("text=3")
        await asyncio.sleep(1)
        await page.click("text==")
        await asyncio.sleep(1)
        await expect(page.locator("#result")).to_have_value("5")
        await asyncio.sleep(2)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
