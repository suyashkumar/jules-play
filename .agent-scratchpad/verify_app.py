from playwright.sync_api import Page, expect

def test_take_screenshot(page: Page):
    # The app is a local file, so we use a file:// URL
    import os
    page.goto(f"file://{os.getcwd()}/index.html")
    page.screenshot(path=".agent-scratchpad/resistor-app.png")
