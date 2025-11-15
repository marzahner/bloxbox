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
 * - pattern-size (optional): Size of pattern tiles (e.g., "50px", "20%", or "auto" - default: "auto")
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
    "pattern-size",
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
    const patternSize = this.getAttribute("pattern-size") || "auto";
    const tintColor = this.getAttribute("tint");

    const hasTextSection =
      (title !== null && title !== "") || (tag !== null && tag !== "");

    // Convert radial color to RGB if needed
    let radialRgb = null;
    if (radialColor && radialColor.length >= 6) {
      radialRgb = {
        r: parseInt(radialColor.substring(0, 2), 16),
        g: parseInt(radialColor.substring(2, 4), 16),
        b: parseInt(radialColor.substring(4, 6), 16),
      };
    }

    // Build background CSS for top-section
    let topSectionBgStyle = `background-color: #${bgColor};`;
    if (gradientColors) {
      const colors = gradientColors.split(",");
      topSectionBgStyle = `background: linear-gradient(to top, #${
        colors[0]
      }, #${colors[1] || colors[0]});`;
    }

    if (patternSrc) {
      const patternSizeValue =
        patternSize.includes("px") ||
        patternSize.includes("%") ||
        patternSize === "auto"
          ? patternSize
          : `${patternSize}px`;

      if (gradientColors) {
        const colors = gradientColors.split(",");
        // Pattern on top of gradient (first listed is on top in CSS)
        topSectionBgStyle = `background: url(${patternSrc}), linear-gradient(to top, #${
          colors[0]
        }, #${
          colors[1] || colors[0]
        }); background-repeat: repeat, no-repeat; background-size: ${patternSizeValue}, 100% 100%;`;
      } else {
        topSectionBgStyle = `background-color: #${bgColor}; background-image: url(${patternSrc}); background-repeat: repeat; background-size: ${patternSizeValue};`;
      }
    }

    const style = document.createElement("style");
    style.textContent = `
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
        ${topSectionBgStyle}
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
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .image-wrapper {
        position: relative;
        display: inline-block;
        max-width: 100%;
        max-height: 100%;
      }

      .image-layer img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        display: block;
        position: relative;
        z-index: 1;
      }

      .image-wrapper.radial-gradient::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        pointer-events: none;
        mix-blend-mode: multiply;
        ${
          radialRgb
            ? `background: radial-gradient(circle at center, transparent 0%, transparent 85%, rgba(${radialRgb.r}, ${radialRgb.g}, ${radialRgb.b}, 0.3) 90%, rgba(${radialRgb.r}, ${radialRgb.g}, ${radialRgb.b}, 0.6) 92%, rgba(${radialRgb.r}, ${radialRgb.g}, ${radialRgb.b}, 0.85) 95%, rgba(${radialRgb.r}, ${radialRgb.g}, ${radialRgb.b}, 1) 100%);`
            : ""
        }
      }

      .tint-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 3;
        mix-blend-mode: color;
        pointer-events: none;
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
        background-color: #FFFFFF;
        min-height: 20px;
      }

      .title {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 24px;
        font-weight: 700;
        line-height: 140%;
        letter-spacing: -0.48px;
        text-align: left;
        color: #000000;
        margin: 0;
      }

      .tag {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 16px;
        font-weight: 600;
        line-height: 140%;
        letter-spacing: 0;
        text-align: left;
        color: #000000;
        margin: 0;
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

      const imageWrapper = document.createElement("div");
      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = "";
      img.onerror = () => {
        console.warn(`CardImg: Failed to load image: ${imgSrc}`);
      };

      // Apply radial gradient directly to the image using wrapper with pseudo-element
      if (radialColor && radialColor.length >= 6) {
        imageWrapper.className = "image-wrapper radial-gradient";
      } else {
        imageWrapper.className = "image-wrapper";
      }

      imageWrapper.appendChild(img);
      imageLayer.appendChild(imageWrapper);
      topSection.appendChild(imageLayer);
    }

    // Tint layer (on top of everything)
    if (tintColor) {
      const tintLayer = document.createElement("div");
      tintLayer.className = "tint-layer";
      tintLayer.style.backgroundColor = `#${tintColor}`;
      topSection.appendChild(tintLayer);
    }

    container.appendChild(topSection);

    // Bottom section (only if title or tag exists)
    if (hasTextSection) {
      const bottomSection = document.createElement("div");
      bottomSection.className = "bottom-section";

      if (title !== null && title !== "") {
        const titleEl = document.createElement("div");
        titleEl.className = "title";
        titleEl.textContent = title;
        bottomSection.appendChild(titleEl);
      }

      if (tag !== null && tag !== "") {
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
