## <v-stack-responsive>

`v-stack-responsive` groups elements vertically on mobile, horizontally on desktop.

### Attributes:

- `gap` (optional): Gap between items in pixels on mobile (default: 0)
- `desktop-gap` (optional): Gap between items in pixels on desktop (default: same as gap)
- `items-align` (optional): stretch, center, start, end, baseline (default: stretch)
- `justify` (optional): flex-start, flex-end, center, space-between, space-around (default: flex-start)
- `desktop-breakpoint` (optional): Breakpoint in pixels where layout switches to horizontal (default: 768)

```html
<!-- Basic Responsive Stack -->
<v-stack-responsive role="group">
  <icon-svg name="font"></icon-svg>
  <h1>Title</h1>
</v-stack-responsive>
```

```html
<!-- With Gap -->
<v-stack-responsive gap="16">
  <button>Clear</button>
  <button>Undo</button>
  <button>Accept</button>
</v-stack-responsive>
```

```html
<!-- With Desktop Breakpoint -->
<v-stack-responsive gap="16" desktop-breakpoint="768">
  <button>Previous</button>
  <button>Next</button>
</v-stack-responsive>
```

```html
<!-- With Different Desktop Gap -->
<v-stack-responsive gap="8" desktop-gap="16">
  <span>Top</span>
  <span>Bottom</span>
</v-stack-responsive>
```

```html
<!-- With Alignment -->
<v-stack-responsive gap="16" items-align="center" role="group">
  <button>Previous</button>
  <button>Next</button>
</v-stack-responsive>
```

````js
/**
 * VStackResponsive Web Component
 *
 * Responsive vertical stack that switches to horizontal on desktop.
 *
 * Usage examples:
 *
 * <!-- Basic responsive stack -->
 * ```
 * <v-stack-responsive role="group">
 *   <icon-svg name="font"></icon-svg>
 *   <h1>Title</h1>
 * </v-stack-responsive>
 * ```
 * <!-- With gap spacing -->
 * ```
 * <v-stack-responsive gap="16">
 *   <button>Clear</button>
 *   <button>Undo</button>
 *   <button>Accept</button>
 * </v-stack-responsive>
 * ```
 * <!-- With desktop breakpoint -->
 * ```
 * <v-stack-responsive gap="16" desktop-breakpoint="768">
 *   <button>Previous</button>
 *   <button>Next</button>
 * </v-stack-responsive>
 * ```
 * <!-- With different desktop gap -->
 * ```
 * <v-stack-responsive gap="8" desktop-gap="16">
 *   <span>Top</span>
 *   <span>Bottom</span>
 * </v-stack-responsive>
 * ```
 * Attributes:
 * - gap (optional): Gap between items in pixels on mobile (default: 0)
 * - desktop-gap (optional): Gap between items in pixels on desktop (default: same as gap)
 * - items-align (optional): align-items value - stretch, center, start, end, baseline (default: stretch)
 * - justify (optional): justify-content value - flex-start, flex-end, center, space-between, space-around (default: flex-start)
 * - desktop-breakpoint (optional): Breakpoint in pixels where layout switches to horizontal (default: 768)
 *
 * The component creates a vertical flex container on mobile, horizontal on desktop
 */

class VStackResponsive extends HTMLElement {
  static observedAttributes = [
    "gap",
    "desktop-gap",
    "items-align",
    "justify",
    "desktop-breakpoint",
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
    const desktopGap = this.getAttribute("desktop-gap") || gap;
    const align = this.getAttribute("items-align") || "stretch";
    const justify = this.getAttribute("justify") || "flex-start";
    const breakpoint = this.getAttribute("desktop-breakpoint") || "768";

    const style = document.createElement("style");
    style.textContent = `
        :host {
          display: flex;
          flex-direction: column;
          align-items: ${align};
          justify-content: ${justify};
          gap: ${gap}px;
        }
        ::slotted(*) {
          flex-shrink: 0;
        }
        @media (min-width: ${breakpoint}px) {
          :host {
            flex-direction: row;
            gap: ${desktopGap}px;
          }
        }
      `;

    const slot = document.createElement("slot");

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(slot);
  }
}

customElements.define("v-stack-responsive", VStackResponsive);
````

