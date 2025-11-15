## <icon-svg>

`icon-svg` lets you use SVGs with (optional) text while maintaining clean, readable HTML code.

### Attributes:

- `name` (required): Name of the SVG file in assets/icons (without .svg extension)
- `size` (optional): Size in pixels (default size: 18)
- `color` (optional) Explicit color value (default color: inherits from CSS classes):

The component automatically:

- Loads SVG files from assets/icons/{name}.svg
- Handles stroke-based icons (preserves fill="none")
- Handles fill-based icons
- Inherits color from CSS classes when no explicit color is set

```html
<!-- Basic Icon -->
<icon-svg name="font" class="text-white"></icon-svg>
```

```html
<!-- Custom Size -->
<icon-svg name="font" size="32" class="text-white"></icon-svg>
```

```html
<!-- Explicit Color -->
<icon-svg name="font" color="#020DE4" size="20"></icon-svg>
```

```html
<!-- Inherit Color -->
<span class="text-white">
  <icon-svg name="font" size="16"></icon-svg> View
</span>
```

```html
<!-- In &lt;h-stack&gt; -->
<h-stack role="group">
  <icon-svg name="font"></icon-svg>
  <h3>Character</h3>
</h-stack>
```

```js
/**
 * <icon-svg> Web Component
 *
 * Usage examples:
 *
 * <!-- Basic usage with icon name -->
 * <icon-svg name="font" class="text-white"></icon-svg>
 *
 * <!-- Custom size -->
 * <icon-svg name="font" size="32" class="text-white"></icon-svg>
 *
 * <!-- Explicit color -->
 * <icon-svg name="font" color="#ff0000" size="20"></icon-svg>
 *
 * <!-- Inherit color from CSS class -->
 * <span class="text-white">
 *   <icon-svg name="preview" size="16"></icon-svg> View
 * </span>
 *
 * <!-- In <h-stack> -->
 * <h-stack role="group">
 *   <icon-svg name="chevron_bottom" class="text-white h-margin-4" size="16"></icon-svg>
 *   <h3 class="text text-white">Character</h3>
 * </h-stack>
 *
 * Attributes:
 * - name (required): Name of the SVG file in assets/icons/ (without .svg extension)
 * - size (optional): Size in pixels (default: 18)
 * - color (optional): Explicit color value (default: inherits from CSS classes)
 *
 * The component automatically:
 * - Loads SVG files from assets/icons/{name}.svg
 * - Handles stroke-based icons (preserves fill="none")
 * - Handles fill-based icons
 * - Inherits color from CSS classes when no explicit color is set
 */

class IconSvg extends HTMLElement {
  static observedAttributes = ["name", "size", "color"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Only re-render if the value actually changed
    if (oldValue !== newValue) {
      this.render();
    }
  }

  async render() {
    const name = this.getAttribute("name");
    if (!name) {
      this.shadowRoot.innerHTML = "";
      return;
    }

    const size = this.getAttribute("size") || "18";
    let color = this.getAttribute("color");

    // If no explicit color, inherit from computed styles (for class-based colors)
    if (!color) {
      const computedStyle = getComputedStyle(this);
      color = computedStyle.color || "currentColor";
    }

    try {
      const iconPath = `assets/icons/${name}.svg`;
      const response = await fetch(iconPath);
      if (!response.ok) {
        throw new Error(`SVG not found: ${name}.svg`);
      }
      const svgText = await response.text();

      // Parse SVG and apply size/color
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
      const svgElement = svgDoc.querySelector("svg");

      if (!svgElement) {
        throw new Error("Invalid SVG format");
      }

      // Set size
      svgElement.setAttribute("width", size);
      svgElement.setAttribute("height", size);
      svgElement.style.display = "block";

      // Check if root SVG is stroke-based (has fill="none" and stroke)
      const rootFill = svgElement.getAttribute("fill");
      const rootStroke = svgElement.getAttribute("stroke");
      const isStrokeBased =
        (rootFill === "none" || rootFill === null) && rootStroke;

      // Apply color to all paths and shapes
      const shapes = svgElement.querySelectorAll(
        "path, circle, rect, polygon, line, polyline, ellipse"
      );
      shapes.forEach((el) => {
        const existingFill = el.getAttribute("fill");
        const existingStroke = el.getAttribute("stroke");

        // If element has stroke attribute, it's stroke-based
        if (existingStroke && existingStroke !== "none") {
          el.setAttribute("stroke", color);
          // Preserve fill="none" for stroke-only icons
          if (existingFill === null || existingFill === "none") {
            el.setAttribute("fill", "none");
          } else if (existingFill !== "none") {
            // Element has both fill and stroke, apply color to both
            el.setAttribute("fill", color);
          }
        } else if (isStrokeBased) {
          // Root SVG is stroke-based - apply stroke color to elements that inherit it
          el.setAttribute("stroke", color);
          // Preserve fill="none" for stroke-only icons
          if (existingFill === null || existingFill === "none") {
            el.setAttribute("fill", "none");
          }
        } else {
          // Fill-based icon: apply fill color
          if (existingFill !== "none" && existingFill !== null) {
            el.setAttribute("fill", color);
          } else if (existingFill === null) {
            el.setAttribute("fill", color);
          }
        }
      });

      // Also update root SVG stroke if it exists
      if (rootStroke && rootStroke !== "none") {
        svgElement.setAttribute("stroke", color);
      }

      // Style wrapper
      const style = document.createElement("style");
      style.textContent = `
          :host {
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          svg {
            display: block;
            width: ${size}px;
            height: ${size}px;
          }
        `;

      this.shadowRoot.innerHTML = "";
      this.shadowRoot.appendChild(style);
      this.shadowRoot.appendChild(svgElement);
    } catch (error) {
      console.warn(`Icon "${name}" not found:`, error);
      this.shadowRoot.innerHTML = "";
    }
  }
}

customElements.define("icon-svg", IconSvg);
```
