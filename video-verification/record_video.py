from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(record_video_dir="video-verification/videos")
        page = context.new_page()
        page.goto("http://localhost:8000")

        # Perform some calculations
        page.click('button:text("1")')
        time.sleep(0.5)
        page.click('button:text("2")')
        time.sleep(0.5)
        page.click('button:text("+")')
        time.sleep(0.5)
        page.click('button:text("3")')
        time.sleep(0.5)
        page.click('button:text("=")')
        time.sleep(1)

        page.click('button:text("AC")')
        time.sleep(0.5)

        page.click('button:text("5")')
        time.sleep(0.5)
        page.click('button:text("×")')
        time.sleep(0.5)
        page.click('button:text("6")')
        time.sleep(0.5)
        page.click('button:text("=")')
        time.sleep(1)

        context.close()
        browser.close()

run()
