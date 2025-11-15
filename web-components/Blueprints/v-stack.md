## <v-stack>

`v-stack` groups elements vertically in your HTML.

### Attributes:

- `gap` (optional): Gap between items in pixels (default: 0)
- `items-align` (optional): stretch, center, start, end, baseline (default: stretch)
- `justify` (optional) flex-start, flex-end, center, space-between, space-around (default: flex-start)

```html
<!-- Basic Stack -->
<v-stack>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</v-stack>
```

```html
<!-- With Gap -->
<v-stack gap="20">
  <h3>Title</h3>
  <p>Description</p>
  <button>Action</button>
</v-stack>
```

```html
<!-- With Alignment -->
<v-stack gap="16" items-align="center">
  <button>Button 1</button>
  <button>Button 2</button>
</v-stack>
```

```html
<!-- With justify-content -->
<v-stack justify="space-between">
  <header>Header</header>
  <main>Content</main>
  <footer>Footer</footer>
</v-stack>
```

```js
/**
 * VStack Web Component
 *
 * Usage examples:
 *
 * <!-- Basic vertical stack -->
 * <v-stack>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </v-stack>
 *
 * <!-- With gap spacing -->
 * <v-stack gap="20">
 *   <h3>Title</h3>
 *   <p>Description</p>
 *   <button>Action</button>
 * </v-stack>
 *
 * <!-- With alignment -->
 * <v-stack gap="16" items-align="center">
 *   <button>Button 1</button>
 *   <button>Button 2</button>
 * </v-stack>
 *
 * <!-- With justify-content -->
 * <v-stack justify="space-between" style="height: 100vh;">
 *   <header>Header</header>
 *   <main>Content</main>
 *   <footer>Footer</footer>
 * </v-stack>
 *
 * Attributes:
 * - gap (optional): Gap between items in pixels (default: 0)
 * - items-align (optional): align-items value - stretch, center, start, end, baseline (default: stretch)
 * - justify (optional): justify-content value - flex-start, flex-end, center, space-between, space-around (default: flex-start)
 *
 * The component creates a vertical flex container (flex-direction: column)
 */

class VStack extends HTMLElement {
  static observedAttributes = ["gap", "items-align", "justify"];

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
    const align = this.getAttribute("items-align") || "stretch";
    const justify = this.getAttribute("justify") || "flex-start";

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
    `;

    const slot = document.createElement("slot");

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(slot);
  }
}

customElements.define("v-stack", VStack);
```
