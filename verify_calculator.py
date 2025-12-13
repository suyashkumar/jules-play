import os
import time
from playwright.sync_api import sync_playwright

def verify_calculator():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        # Create a context with video recording enabled
        context = browser.new_context(record_video_dir="videos/")
        page = context.new_page()

        # Load the local HTML file
        page.goto(f"file://{os.getcwd()}/index.html")

        # Helper to click with delay
        def click_btn(selector):
            page.click(selector)
            time.sleep(1) # Delay for visibility

        print("Starting calculator verification...")
        time.sleep(1)

        # Perform 12 + 8 = 20
        click_btn('button[data-num="1"]')
        click_btn('button[data-num="2"]')
        click_btn('button[data-action="add"]')
        click_btn('button[data-num="8"]')
        click_btn('button[data-action="equals"]')

        # Check result
        display_text = page.inner_text('#display')
        print(f"Result: {display_text}")

        if display_text == "20":
            print("Calculation verified successfully.")
        else:
            print(f"Calculation failed. Expected 20, got {display_text}")

        # Clear
        click_btn('button[data-action="ac"]')

        # Perform 5 * 6 = 30
        click_btn('button[data-num="5"]')
        click_btn('button[data-action="multiply"]')
        click_btn('button[data-num="6"]')
        click_btn('button[data-action="equals"]')

        display_text = page.inner_text('#display')
        print(f"Result: {display_text}")

        time.sleep(1)

        # Close context to save video
        context.close()
        browser.close()

if __name__ == "__main__":
    verify_calculator()
