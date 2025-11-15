## <card-img>

`card-img` displays images in a card format with customizable background colors, effects, and optional text sections.

### Attributes:

- `img` (required): Image source path (supports PNG, JPG, SVG, and other image formats)
- `title` (optional): Title text for bottom section
- `tag` (optional): Tagline text for bottom section
- `color` (optional): Background color hex code without # (default: FFD600)
- `radial` (optional): Radial gradient color hex code without # (fades from outside edge to 92%)
- `gradient` (optional): Normal gradient colors "color1,color2" (bottom to top)
- `pattern` (optional): Pattern image/SVG source path (tiled on background)
- `pattern-size` (optional): Size of pattern tiles (e.g., "50px", "20%", or "auto" - default: "auto")
- `tint` (optional): Tint color hex code without # (applies color blend mode)

### Sizing:

- Top section: 290px × 275px with 2px solid black border
- Bottom section: 290px width, auto height, 20px padding, 2px solid black border (only renders if title or tag provided)
- Text styling: Inter font, title (24px bold, 140% line height, -0.48px letter spacing), tag (16px semibold, 140% line height, 0 letter spacing)
- 8px gap between title and tagline

### Effects:

Effects can be combined in any order:

1. **Radial gradient**: Fades from outside edge (100% opacity) to 92% radius (0% opacity)
2. **Normal gradient**: Linear gradient from bottom to top with 2 colors
3. **Pattern**: Tiles an image/SVG on the background color
4. **Tint**: Applies a color layer with blend mode "color" on top of the image

```html
<!-- Basic usage -->
<card-img
  img="assets/images/cow.avif"
  title="How to Count in Spanish: Numbers"
  tag="SATURDAY - 4PM"
></card-img>
```

```html
<!-- Radial gradient effect -->
<card-img
  img="assets/images/cow.avif"
  radial="0176E0"
  title="How to Count in Spanish: Numbers"
  tag="SATURDAY - 4PM"
></card-img>
```

```html
<!-- Normal gradient effect -->
<card-img
  img="assets/images/cow.avif"
  gradient="0176E0,FFFFFF"
  title="How to Count in Spanish: Numbers"
  tag="SATURDAY - 4PM"
></card-img>
```

```html
<!-- Pattern effect -->
<card-img
  img="assets/images/cow.avif"
  pattern="assets/icons/font.svg"
></card-img>
```

```html
<!-- Pattern effect with custom tile size -->
<card-img
  img="assets/images/cow.avif"
  pattern="assets/icons/font.svg"
  pattern-size="40px"
></card-img>
```

```html
<!-- Tint effect -->
<card-img img="assets/images/cow.avif" tint="0176E0"></card-img>
```

```html
<!-- Combined effects -->
<card-img
  img="assets/images/cow.avif"
  radial="0176E0"
  tint="FFFFFF"
  title="Title"
  tag="Tag"
></card-img>
```

````js
/**
 * Card Image Web Component
 *
 * Usage examples:
 *
 * <!-- Basic usage -->
 * ```
 * <card-img img="path/to/image.png" title="Title" tag="Tag"></card-img>
 * ```
 * <!-- Radial gradient effect -->
 * ```
 * <card-img img="path/to/image.png" radial="0176E0" title="Title" tag="Tag"></card-img>
 * ```
 * <!-- Normal gradient effect -->
 * ```
 * <card-img img="path/to/image.png" gradient="0176E0,FFFFFF" title="Title" tag="Tag"></card-img>
 * ```
 * <!-- Pattern effect -->
 * ```
 * <card-img img="path/to/image.png" pattern="path/to/pattern.svg"></card-img>
 * ```
 * <!-- Tint effect -->
 * ```
 * <card-img img="path/to/image.png" tint="0176E0"></card-img>
 * ```
 * <!-- Combined effects -->
 * ```
 * <card-img img="path/to/image.png" radial="0176E0" tint="FFFFFF" title="Title" tag="Tag"></card-img>
 * ```
 * Attributes:
 * - img (required): Image source path
 * - title (optional): Title text for bottom section
 * - tag (optional): Tagline text for bottom section
 * - color (optional): Background color hex code without # (default: FFD600)
 * - radial (optional): Radial gradient color hex code without # (default stop: 92%)
 * - gradient (optional): Normal gradient colors "color1,color2" (bottom to top)
 * - pattern (optional): Pattern image/SVG source path (tiled)
 * - tint (optional): Tint color hex code without # (blend mode: color)
 */

class CardImg extends HTMLElement {
  static observedAttributes = [
    "img",
    "title",
    "tag",
    "color",
    "radial",
    "gradient",
    "pattern",
    "tint",
  ];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const imgSrc = this.getAttribute("img");
    const title = this.getAttribute("title");
    const tag = this.getAttribute("tag");
    const bgColor = this.getAttribute("color") || "FFD600";
    const radialColor = this.getAttribute("radial");
    const gradientColors = this.getAttribute("gradient");
    const patternSrc = this.getAttribute("pattern");
    const tintColor = this.getAttribute("tint");

    const hasTextSection = title || tag;

    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
      
      :host {
        display: inline-block;
      }

      .card-container {
        display: flex;
        flex-direction: column;
        width: 290px;
      }

      .top-section {
        width: 290px;
        height: 275px;
        background-color: #${bgColor};
        border: 2px solid #000000;
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
      }

      .image-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
      }

      .image-layer img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
      }

      .effect-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      .radial-gradient {
        z-index: 2;
      }

      .normal-gradient {
        z-index: 2;
      }

      .pattern-layer {
        z-index: 2;
      }

      .tint-layer {
        z-index: 3;
        mix-blend-mode: color;
      }

      .bottom-section {
        width: 290px;
        border: 2px solid #000000;
        border-top: none;
        padding: 20px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 8px;
        justify-content: space-between;
      }

      .title {
        font-family: 'Inter', sans-serif;
        font-size: 24px;
        font-weight: 700;
        line-height: 140%;
        letter-spacing: -0.48px;
        text-align: left;
        color: #000000;
      }

      .tag {
        font-family: 'Inter', sans-serif;
        font-size: 16px;
        font-weight: 600;
        line-height: 140%;
        letter-spacing: 0;
        text-align: left;
        color: #000000;
      }
    `;

    const container = document.createElement("div");
    container.className = "card-container";

    // Top section
    const topSection = document.createElement("div");
    topSection.className = "top-section";

    // Image layer
    if (imgSrc) {
      const imageLayer = document.createElement("div");
      imageLayer.className = "image-layer";
      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = "";
      img.onerror = () => {
        console.warn(`CardImg: Failed to load image: ${imgSrc}`);
      };
      imageLayer.appendChild(img);
      topSection.appendChild(imageLayer);
    }

    // Effect layers (order matters for z-index)
    if (radialColor) {
      const radialLayer = document.createElement("div");
      radialLayer.className = "effect-layer radial-gradient";
      // Convert hex to rgb for rgba
      const r = parseInt(radialColor.substring(0, 2), 16);
      const g = parseInt(radialColor.substring(2, 4), 16);
      const b = parseInt(radialColor.substring(4, 6), 16);
      radialLayer.style.background = `radial-gradient(circle, transparent 0%, rgba(${r}, ${g}, ${b}, 0) 92%, rgba(${r}, ${g}, ${b}, 1) 100%)`;
      topSection.appendChild(radialLayer);
    }

    if (gradientColors) {
      const colors = gradientColors.split(",");
      const gradientLayer = document.createElement("div");
      gradientLayer.className = "effect-layer normal-gradient";
      gradientLayer.style.background = `linear-gradient(to top, #${
        colors[0]
      }, #${colors[1] || colors[0]})`;
      topSection.appendChild(gradientLayer);
    }

    if (patternSrc) {
      const patternLayer = document.createElement("div");
      patternLayer.className = "effect-layer pattern-layer";
      patternLayer.style.backgroundImage = `url(${patternSrc})`;
      patternLayer.style.backgroundRepeat = "repeat";
      patternLayer.style.backgroundSize = "auto";
      topSection.appendChild(patternLayer);
    }

    if (tintColor) {
      const tintLayer = document.createElement("div");
      tintLayer.className = "effect-layer tint-layer";
      tintLayer.style.backgroundColor = `#${tintColor}`;
      topSection.appendChild(tintLayer);
    }

    container.appendChild(topSection);

    // Bottom section (only if title or tag exists)
    if (hasTextSection) {
      const bottomSection = document.createElement("div");
      bottomSection.className = "bottom-section";

      if (title) {
        const titleEl = document.createElement("div");
        titleEl.className = "title";
        titleEl.textContent = title;
        bottomSection.appendChild(titleEl);
      }

      if (tag) {
        const tagEl = document.createElement("div");
        tagEl.className = "tag";
        tagEl.textContent = tag;
        bottomSection.appendChild(tagEl);
      }

      container.appendChild(bottomSection);
    }

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);
  }
}

customElements.define("card-img", CardImg);
````
