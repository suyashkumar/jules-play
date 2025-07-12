from playwright.sync_api import Page, expect
import os

# Constants matching script.js
SWATCH_HEIGHT = 40

def get_color_index(wheel_id, color_name):
    """Gets the index of a color in its respective wheel."""
    if wheel_id in ['band1', 'band2']:
        colors = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'grey', 'white']
    elif wheel_id == 'band3':
        colors = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'grey', 'white', 'gold', 'silver']
    else: # band4
        colors = ['brown', 'red', 'green', 'blue', 'violet', 'grey', 'gold', 'silver', 'none']
    return colors.index(color_name)

def test_resistor_calculator_scrolling(page: Page):
    dir_path = os.path.dirname(os.path.realpath(__file__))
    file_path = os.path.join(dir_path, 'index.html')
    page.goto(f"file://{file_path}")

    # Wait for the wheels to be populated
    page.wait_for_selector('#band1-wheel .color-swatch')

    # Allow time for initial value to be set and rendered
    page.wait_for_timeout(500)

    # Initial state check
    expect(page.locator("#resistor-value")).to_contain_text("57.0 KΩ ±5%")

    # --- Interaction Phase ---
    # Scroll band 1 to Brown (index 1)
    target_scroll_top_1 = get_color_index('band1', 'brown') * SWATCH_HEIGHT
    page.locator('#band1-wheel').evaluate(f'el => el.scrollTo(0, {target_scroll_top_1})')
    page.wait_for_timeout(300) # Wait for scroll and calculation
    expect(page.locator("#resistor-value")).to_contain_text("17.0 KΩ ±5%")

    # Scroll band 2 to Red (index 2)
    target_scroll_top_2 = get_color_index('band2', 'red') * SWATCH_HEIGHT
    page.locator('#band2-wheel').evaluate(f'el => el.scrollTo(0, {target_scroll_top_2})')
    page.wait_for_timeout(300)
    expect(page.locator("#resistor-value")).to_contain_text("12.0 KΩ ±5%")

    # Scroll band 3 (multiplier) to Yellow (index 4)
    target_scroll_top_3 = get_color_index('band3', 'yellow') * SWATCH_HEIGHT
    page.locator('#band3-wheel').evaluate(f'el => el.scrollTo(0, {target_scroll_top_3})')
    page.wait_for_timeout(300)
    expect(page.locator("#resistor-value")).to_contain_text("120 KΩ ±5%")

    # Scroll band 4 (tolerance) to Red (index 1)
    target_scroll_top_4 = get_color_index('band4', 'red') * SWATCH_HEIGHT
    page.locator('#band4-wheel').evaluate(f'el => el.scrollTo(0, {target_scroll_top_4})')
    page.wait_for_timeout(500) # Final pause

    # Final state check
    expect(page.locator("#resistor-value")).to_contain_text("120 KΩ ±2%")

# To run: pytest test_resistor_calculator.py --video on --screenshot on
