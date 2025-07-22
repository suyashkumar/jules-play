import re
from playwright.sync_api import Page, expect
import time
import os

def test_calculator(page: Page):
    # Get the absolute path to the index.html file
    file_path = os.path.abspath('index.html')
    page.goto(f'file://{file_path}')

    # Click 7
    page.click('button:has-text("7")')
    time.sleep(0.5)

    # Click *
    page.click('button:has-text("*")')
    time.sleep(0.5)

    # Click 6
    page.click('button:has-text("6")')
    time.sleep(0.5)

    # Click =
    page.click('button:has-text("=")')
    time.sleep(0.5)

    # Check the result
    display = page.locator('#display')
    expect(display).to_have_text('42')
    time.sleep(2)
