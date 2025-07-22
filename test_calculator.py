import time
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context(record_video_dir="videos/")
    page = context.new_page()

    # Navigate to the local calculator app
    # The path needs to be absolute to the root of the container
    page.goto("file:///app/index.html")

    # Perform a calculation: 1 + 2 * 3
    page.click("text=1")
    time.sleep(1)
    page.click("text=+")
    time.sleep(1)
    page.click("text=2")
    time.sleep(1)
    page.click("text=*")
    time.sleep(1)
    page.click("text=3")
    time.sleep(1)
    page.click("text==")
    time.sleep(1)

    # Verify the result
    result = page.input_value("#result")
    print(f"Calculator result: {result}")
    assert result == "7"
    time.sleep(2)

    # Perform another calculation: 8 / 4
    page.click("text=C")
    time.sleep(1)
    page.click("text=8")
    time.sleep(1)
    page.click("text=/")
    time.sleep(1)
    page.click("text=4")
    time.sleep(1)
    page.click("text==")
    time.sleep(1)

    # Verify the result
    result = page.input_value("#result")
    print(f"Calculator result: {result}")
    assert result == "2"
    time.sleep(2)

    # Close browser
    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
