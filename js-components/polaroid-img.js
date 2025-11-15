/**
 * Polaroid Web Component
 *
 * Usage examples:
 *
 * <!-- Basic usage with image -->
 * ```
 * <polaroid-img img="path/to/image.png"></polaroid-img>
 * ```
 * <!-- No background color -->
 * ```
 * <polaroid-img img="path/to/image.png" none></polaroid-img>
 * ```
 * <!-- Circular background -->
 * ```
 * <polaroid-img img="path/to/image.png" round="9999"></polaroid-img>
 * ```
 * <!-- Image offset -->
 * ```
 * <polaroid-img img="path/to/image.png" offset="30"></polaroid-img>
 * ```
 * <!-- Custom background color -->
 * ```
 * <polaroid-img img="path/to/image.png" color="CAEE64"></polaroid-img>
 * ```
 * <!-- Tint image with background color -->
 * ```
 * <polaroid-img img="path/to/image.png" tint></polaroid-img>
 * ```
 * <!-- Combined attributes -->
 * ```
 * <polaroid-img img="path/to/image.png" color="CAEE64" round="9999" offset="30" tint></polaroid-img>
 * ```
 * Attributes:
 * - img (required): Image source path (supports PNG, JPG, SVG, and other image formats)
 * - none (optional): Removes background color, shows white background only
 * - round (optional): Inner container border-radius in pixels (default: 0)
 * - offset (optional): Bottom margin for image in pixels to move it up (default: 0)
 * - color (optional): Background color hex code without # (default: FFD600)
 * - tint (optional): Applies color blend mode to image using background color
 *
 * Responsive sizing:
 * - Desktop (>=650px): 300px × 300px outer, 50px padding, 200px × 200px inner
 * - Mobile (<650px): 200px × 200px outer, 33px padding, 134px × 134px inner
 * - Outer container always has 8px border-radius
 */

class PolaroidImg extends HTMLElement {
  static observedAttributes = [
    "img",
    "none",
    "round",
    "offset",
    "color",
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
    const hasNone = this.hasAttribute("none");
    const round = this.getAttribute("round") || "0";
    const offset = this.getAttribute("offset") || "0";
    const color = this.getAttribute("color") || "FFD600";
    const hasTint = this.hasAttribute("tint");

    const bgColor = hasNone ? "#FFFFFF" : `#${color}`;

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: inline-block;
      }

      .outer-frame {
        width: 300px;
        height: 300px;
        padding: 50px;
        background-color: #FFFFFF;
        border: 2px solid #000000;
        border-radius: 8px;
        box-sizing: border-box;
        position: relative;
      }

      .inner-container {
        width: 100%;
        height: 100%;
        background-color: ${bgColor};
        border-radius: ${round}px;
        position: relative;
        overflow: hidden;
      }

      .image-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .image-wrapper img {
        position: absolute;
        bottom: ${offset}px;
        left: 0;
        width: 100%;
        height: calc(100% + ${offset}px);
        object-fit: cover;
      }

      .tint-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: ${bgColor};
        mix-blend-mode: color;
        pointer-events: none;
      }

      @media (max-width: 649px) {
        .outer-frame {
          width: 200px;
          height: 200px;
          padding: 33px;
        }
      }
    `;

    const outerFrame = document.createElement("div");
    outerFrame.className = "outer-frame";

    const innerContainer = document.createElement("div");
    innerContainer.className = "inner-container";

    if (imgSrc) {
      const imageWrapper = document.createElement("div");
      imageWrapper.className = "image-wrapper";

      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = "";
      img.onerror = () => {
        console.warn(`PolaroidImg: Failed to load image: ${imgSrc}`);
      };
      imageWrapper.appendChild(img);

      if (hasTint) {
        const tintLayer = document.createElement("div");
        tintLayer.className = "tint-layer";
        imageWrapper.appendChild(tintLayer);
      }

      innerContainer.appendChild(imageWrapper);
    }

    outerFrame.appendChild(innerContainer);

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(outerFrame);
  }
}

customElements.define("polaroid-img", PolaroidImg);
