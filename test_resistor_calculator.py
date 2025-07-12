import re
from playwright.sync_api import Page, expect
import os

def test_resistor_calculator(page: Page):
    # Get the absolute path to the index.html file
    dir_path = os.path.dirname(os.path.realpath(__file__))
    file_path = os.path.join(dir_path, 'index.html')

    page.goto(f"file://{file_path}")

    # Wait for elements to be populated by JS
    page.wait_for_selector('#band4 option[value="none"]', state='attached')

    # Add a small delay to see the initial state in the video
    page.wait_for_timeout(500)

    # Initial state check (based on defaults in script.js)
    expect(page.locator("#resistor-value")).to_have_text("57 KΩ ±5%")

    # Change band 1 to Brown (1)
    page.select_option("#band1", "brown")
    page.wait_for_timeout(200) # pause for video

    # Change band 2 to Red (2)
    page.select_option("#band2", "red")
    page.wait_for_timeout(200) # pause for video

    # Change multiplier to Yellow (10k)
    page.select_option("#band3", "yellow")
    page.wait_for_timeout(200) # pause for video

    # Change tolerance to Red (2%)
    page.select_option("#band4", "red")
    page.wait_for_timeout(500) # final pause for video

    # The test will now verify the final state
    expect(page.locator("#resistor-value")).to_have_text("120 KΩ ±2%")
    expect(page.locator("#preview-band4")).to_have_css("background-color", "rgb(255, 0, 0)") # red

# To run this test and record a video:
# pytest test_resistor_calculator.py --video on
