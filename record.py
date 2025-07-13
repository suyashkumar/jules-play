from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(record_video_dir=".")
    page.goto("http://localhost:8000")
    page.select_option("#band1", "2")
    page.select_option("#band2", "7")
    page.select_option("#multiplier", "1000")
    page.select_option("#tolerance", "5")
    page.close()
    browser.close()
