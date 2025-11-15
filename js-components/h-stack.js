/**
 * HStack Web Component
 *
 * Usage examples:
 *
 * <!-- Basic horizontal stack -->
 * ```
 * <h-stack role="group">
 *   <icon-svg name="font"></icon-svg>
 *   <h1>Title</h1>
 * </h-stack>
 * ```
 * <!-- With gap spacing -->
 * ```
 * <h-stack gap="16">
 *   <button>Clear</button>
 *   <button>Undo</button>
 *   <button>Accept</button>
 * </h-stack>
 * ```
 * <!-- With alignment -->
 * ```
 * <h-stack gap="16" items-align="center" role="group">
 *   <button>Previous</button>
 *   <button>Next</button>
 * </h-stack>
 * ```
 * <!-- With justify-content -->
 * ```
 * <h-stack justify="space-between">
 *   <span>Left</span>
 *   <span>Right</span>
 * </h-stack>
 * ```
 * Attributes:
 * - gap (optional): Gap between items in pixels (default: 0)
 * - items-align (optional): align-items value - stretch, center, start, end, baseline (default: stretch)
 * - justify (optional): justify-content value - flex-start, flex-end, center, space-between, space-around (default: flex-start)
 *
 * The component creates a horizontal flex container (flex-direction: row)
 */

class HStack extends HTMLElement {
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
          flex-direction: row;
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

customElements.define("h-stack", HStack);
