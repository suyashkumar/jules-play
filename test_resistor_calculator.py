import re
from playwright.sync_api import Page, expect, sync_playwright
import time

def test_resistor_calculator(page: Page):
    # Get the absolute path to the index.html file
    import os
    dir_path = os.path.dirname(os.path.realpath(__file__))
    file_path = os.path.join(dir_path, 'index.html')

    page.goto(f"file://{file_path}")

    # Wait for elements to be populated by JS
    # Wait for the last option in the tolerance band to be present
    page.wait_for_selector('#band4 option[value="none"]', state='attached')

    # Initial state check (based on defaults in script.js)
    expect(page.locator("#resistor-value")).to_have_text("57 KΩ ±5%")

    # Change band 1 to Brown (1)
    page.select_option("#band1", "brown")
    expect(page.locator("#resistor-value")).to_have_text("17 KΩ ±5%")
    expect(page.locator("#preview-band1")).to_have_css("background-color", "rgb(165, 42, 42)") # brown

    # Change band 2 to Red (2)
    page.select_option("#band2", "red")
    expect(page.locator("#resistor-value")).to_have_text("12 KΩ ±5%")
    expect(page.locator("#preview-band2")).to_have_css("background-color", "rgb(255, 0, 0)") # red

    # Change multiplier to Yellow (10k)
    page.select_option("#band3", "yellow")
    expect(page.locator("#resistor-value")).to_have_text("120 KΩ ±5%")
    expect(page.locator("#preview-band3")).to_have_css("background-color", "rgb(255, 255, 0)")# yellow

    # Change tolerance to Red (2%)
    page.select_option("#band4", "red")
    expect(page.locator("#resistor-value")).to_have_text("120 KΩ ±2%")
    expect(page.locator("#preview-band4")).to_have_css("background-color", "rgb(255, 0, 0)") # red

    # Test a Giga Ohm value: White, White, Grey, Gold
    page.select_option("#band1", "white")
    page.select_option("#band2", "white")
    page.select_option("#band3", "grey")
    page.select_option("#band4", "gold")
    expect(page.locator("#resistor-value")).to_have_text("9.9 GΩ ±5%")

    # Test a Mega Ohm value: Red, Red, Green, Silver
    page.select_option("#band1", "red")
    page.select_option("#band2", "red")
    page.select_option("#band3", "green")
    page.select_option("#band4", "silver")
    expect(page.locator("#resistor-value")).to_have_text("2.2 MΩ ±10%")

    # Test a direct Ohm value: Black, Brown, Black, Brown
    page.select_option("#band1", "black")
    page.select_option("#band2", "brown")
    page.select_option("#band3", "black")
    page.select_option("#band4", "brown")
    expect(page.locator("#resistor-value")).to_have_text("1 Ω ±1%")

    # Take a screenshot
    screenshot_path = "resistor_calculator_test.png"
    page.screenshot(path=screenshot_path)
    print(f"Screenshot saved to {screenshot_path}")

    # Record a short video
    # Playwright's video recording is typically for the entire test session.
    # For a short clip, we'd usually start/stop recording around specific actions.
    # However, for this task, a screenshot should suffice as requested by "short (3s) video OR screenshot".
    # If a video is strictly required, the test structure would need adjustment.

# To run this test locally:
# 1. Install Playwright: pip install playwright
# 2. Install browser drivers: playwright install
# 3. Run the test: pytest test_resistor_calculator.py (or python -m pytest test_resistor_calculator.py)

if __name__ == '__main__':
    # This is for manual execution if not using pytest
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False) # Launch headed for manual view
        page = browser.new_page()
        try:
            test_resistor_calculator(page)
            print("Test passed! Waiting for 3 seconds before closing.")
            time.sleep(3) # Keep browser open for a few seconds to see
        except Exception as e:
            print(f"Test failed: {e}")
        finally:
            browser.close()
