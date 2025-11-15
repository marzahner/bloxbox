## <h-stack-responsive>

`h-stack-responsive` groups elements horizontally on desktop, vertically on mobile.

### Attributes:

- `gap` (optional): Gap between items in pixels on desktop (default: 0)
- `mobile-gap` (optional): Gap between items in pixels on mobile (default: same as gap)
- `items-align` (optional): stretch, center, start, end, baseline (default: stretch)
- `justify` (optional): flex-start, flex-end, center, space-between, space-around (default: flex-start)
- `mobile-breakpoint` (optional): Breakpoint in pixels where layout switches to vertical (default: 768)

```html
<!-- Basic Responsive Stack -->
<h-stack-responsive role="group">
  <icon-svg name="font"></icon-svg>
  <h1>Title</h1>
</h-stack-responsive>
```

```html
<!-- With Gap -->
<h-stack-responsive gap="16">
  <button>Clear</button>
  <button>Undo</button>
  <button>Accept</button>
</h-stack-responsive>
```

```html
<!-- With Mobile Breakpoint -->
<h-stack-responsive gap="16" mobile-breakpoint="1200">
  <button>Previous</button>
  <button>Next</button>
</h-stack-responsive>
```

```html
<!-- With Different Mobile Gap -->
<h-stack-responsive gap="16" mobile-gap="8">
  <span>Left</span>
  <span>Right</span>
</h-stack-responsive>
```

```html
<!-- With Alignment -->
<h-stack-responsive gap="16" items-align="center" role="group">
  <button>Previous</button>
  <button>Next</button>
</h-stack-responsive>
```

````js
/**
 * HStackResponsive Web Component
 *
 * Responsive horizontal stack that switches to vertical on mobile.
 *
 * Usage examples:
 *
 * <!-- Basic responsive stack -->
 * ```
 * <h-stack-responsive role="group">
 *   <icon-svg name="font"></icon-svg>
 *   <h1>Title</h1>
 * </h-stack-responsive>
 * ```
 * <!-- With gap spacing -->
 * ```
 * <h-stack-responsive gap="16">
 *   <button>Clear</button>
 *   <button>Undo</button>
 *   <button>Accept</button>
 * </h-stack-responsive>
 * ```
 * <!-- With mobile breakpoint -->
 * ```
 * <h-stack-responsive gap="16" mobile-breakpoint="600">
 *   <button>Previous</button>
 *   <button>Next</button>
 * </h-stack-responsive>
 * ```
 * <!-- With different mobile gap -->
 * ```
 * <h-stack-responsive gap="16" mobile-gap="8">
 *   <span>Left</span>
 *   <span>Right</span>
 * </h-stack-responsive>
 * ```
 * Attributes:
 * - gap (optional): Gap between items in pixels on desktop (default: 0)
 * - mobile-gap (optional): Gap between items in pixels on mobile (default: same as gap)
 * - items-align (optional): align-items value - stretch, center, start, end, baseline (default: stretch)
 * - justify (optional): justify-content value - flex-start, flex-end, center, space-between, space-around (default: flex-start)
 * - mobile-breakpoint (optional): Breakpoint in pixels where layout switches to vertical (default: 768)
 *
 * The component creates a horizontal flex container on desktop, vertical on mobile
 */

class HStackResponsive extends HTMLElement {
  static observedAttributes = [
    "gap",
    "mobile-gap",
    "items-align",
    "justify",
    "mobile-breakpoint",
  ];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const gap = this.getAttribute("gap") || "0";
    const mobileGap = this.getAttribute("mobile-gap") || gap;
    const align = this.getAttribute("items-align") || "stretch";
    const justify = this.getAttribute("justify") || "flex-start";
    const breakpoint = this.getAttribute("mobile-breakpoint") || "768";

    const style = document.createElement("style");
    style.textContent = `
        :host {
          display: flex;
          flex-direction: row;
          align-items: ${align};
          justify-content: ${justify};
          gap: ${gap}px;
        }
        ::slotted(*) {
          flex-shrink: 0;
        }
        @media (max-width: ${breakpoint}px) {
          :host {
            flex-direction: column;
            gap: ${mobileGap}px;
          }
        }
      `;

    const slot = document.createElement("slot");

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(slot);
  }
}

customElements.define("h-stack-responsive", HStackResponsive);
````
