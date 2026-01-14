from playwright.sync_api import sync_playwright
import os
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create a context with video recording enabled
        # We'll record to the current directory
        context = browser.new_context(
            record_video_dir=".",
            record_video_size={"width": 800, "height": 600}
        )
        page = context.new_page()

        # Navigate to the calculator
        page.goto("file:///app/index.html")

        # Slow down interactions slightly so they are visible in the video
        def slow_click(selector):
            page.click(selector)
            time.sleep(0.5)

        time.sleep(1) # Show initial state

        # 1. Calculation: 12 + 34 = 46
        slow_click("text=1")
        slow_click("text=2")
        slow_click("text=+")
        slow_click("text=3")
        slow_click("text=4")
        slow_click("text==")

        time.sleep(1) # Show result

        # 2. Clear
        slow_click("text=AC")

        time.sleep(0.5)

        # 3. Calculation: 7 * 6 = 42
        slow_click("text=7")
        slow_click("text=×")
        slow_click("text=6")
        slow_click("text==")

        time.sleep(1) # Show result

        # 4. Delete: 42 -> 4 -> 4.5
        slow_click("text=DEL")
        slow_click("text=.")
        slow_click("text=5")

        time.sleep(1)

        # Get video path before closing context
        video_path = page.video.path()
        print(f"Video created at: {video_path}")

        # Close context to ensure video is saved
        context.close()
        browser.close()

        # Rename the video file
        target_name = "calculator_demo.webm"
        if video_path:
             if os.path.exists(target_name):
                 os.remove(target_name)
             os.rename(video_path, target_name)
             print(f"Video renamed to: {target_name}")

if __name__ == "__main__":
    run()
