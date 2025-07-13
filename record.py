from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(record_video_dir=".")
    page.goto("http://localhost:8000")
    time.sleep(1)
    page.select_option("#band1", "2")
    time.sleep(1)
    page.select_option("#band2", "7")
    time.sleep(1)
    page.select_option("#multiplier", "1000")
    time.sleep(1)
    page.select_option("#tolerance", "5")
    time.sleep(1)
    page.close()
    browser.close()
