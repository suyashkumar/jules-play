import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        await page.goto('https://www.google.com')

        # Type the search query
        # Google's search input name can sometimes change, using a more robust selector
        await page.locator('textarea[name="q"]').fill('what day of the week is it')

        # Press Enter to search
        await page.keyboard.press('Enter')

        # Wait for navigation to the results page or for results to load
        # This might need adjustment based on Google's behavior (e.g., page.wait_for_selector for a specific results element)
        await page.wait_for_load_state('networkidle')

        await page.screenshot(path='google_search_day_screenshot.png')
        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
