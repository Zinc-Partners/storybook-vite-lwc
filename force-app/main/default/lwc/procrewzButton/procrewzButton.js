import { LightningElement, api } from "lwc";

export default class ProcrewzButton extends LightningElement {
  @api label = "Button";
  @api variant = "primary"; // primary, secondary, navy, destructive, ghost
  @api size = "medium"; // small, medium, large
  @api disabled = false;
  @api type = "button"; // button, submit, reset
  @api iconUrl = ""; // URL to icon (static resource)
  @api iconPosition = "left"; // left, right
  @api loading = false;

  _fullWidth = false;

  @api
  get fullWidth() {
    return this._fullWidth;
  }

  set fullWidth(value) {
    this._fullWidth =
      value === true || value === "true" || value === "" || value === "TRUE";
  }

  get computedClass() {
    const classes = ["procrewz-button"];

    classes.push(`procrewz-button--${this.variant}`);
    classes.push(`procrewz-button--${this.size}`);

    if (this.disabled) {
      classes.push("procrewz-button--disabled");
    }

    if (this.fullWidth) {
      classes.push("procrewz-button--full-width");
    }

    if (this.loading) {
      classes.push("procrewz-button--loading");
    }

    if (this.hasIcon) {
      if (!this.label) {
        classes.push("procrewz-button--icon-only");
      } else {
        classes.push("procrewz-button--has-icon");
      }
    }

    return classes.join(" ");
  }

  // Show icon if iconUrl is provided
  get hasIcon() {
    return this.iconUrl && this.iconUrl.length > 0;
  }

  get showIconLeft() {
    return this.hasIcon && this.iconPosition === "left" && !this.loading;
  }

  get showIconRight() {
    return this.hasIcon && this.iconPosition === "right" && !this.loading;
  }

  get isDisabled() {
    return this.disabled || this.loading;
  }

  get iconSize() {
    const sizes = {
      small: "14",
      medium: "16",
      large: "20"
    };
    return sizes[this.size] || "16";
  }

  get spinnerSize() {
    const sizes = {
      small: "12",
      medium: "16",
      large: "20"
    };
    return sizes[this.size] || "16";
  }

  handleClick(event) {
    if (this.isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.dispatchEvent(
      new CustomEvent("buttonclick", {
        detail: {
          label: this.label,
          variant: this.variant
        },
        bubbles: true,
        composed: true
      })
    );
  }

  handleFocus() {
    this.dispatchEvent(
      new CustomEvent("buttonfocus", {
        detail: { label: this.label },
        bubbles: true,
        composed: true
      })
    );
  }

  handleBlur() {
    this.dispatchEvent(
      new CustomEvent("buttonblur", {
        detail: { label: this.label },
        bubbles: true,
        composed: true
      })
    );
  }

  connectedCallback() {
    const fullWidthAttr = this.getAttribute("full-width");
    if (fullWidthAttr !== null && !this._fullWidth) {
      this._fullWidth = fullWidthAttr === "" || fullWidthAttr === "true";
    }
  }
}
