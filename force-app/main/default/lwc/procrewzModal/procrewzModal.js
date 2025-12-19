import { api, LightningElement, track } from "lwc";

export default class ProcrewzModal extends LightningElement {
  @api title = "";
  @api size = "medium"; // small, medium, large, full
  @api hideCloseButton = false;

  @track isOpen = false;

  get modalClass() {
    return `procrewz-modal procrewz-modal--${this.size}`;
  }

  get showCloseButton() {
    return !this.hideCloseButton;
  }

  get showHeader() {
    return this.title || this.showCloseButton;
  }

  @api
  open() {
    const dialog = this.template.querySelector("dialog");
    if (dialog) {
      this.isOpen = true;
      document.body.style.overflow = "hidden";
      dialog.showModal();
      this.dispatchEvent(new CustomEvent("open"));
    }
  }

  @api
  close() {
    const dialog = this.template.querySelector("dialog");
    if (dialog) {
      dialog.close();
      this.isOpen = false;
      document.body.style.overflow = "";
      this.dispatchEvent(new CustomEvent("close"));
    }
  }

  handleBackdropClick(event) {
    // Close when clicking the backdrop (dialog element itself, not content)
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  handleCloseClick() {
    this.close();
  }

  handleKeyDown(event) {
    if (event.key === "Escape") {
      this.close();
    }
  }

  renderedCallback() {
    const dialog = this.template.querySelector("dialog");
    if (dialog && !this._listenerAdded) {
      dialog.addEventListener("close", () => {
        this.isOpen = false;
        document.body.style.overflow = "";
        this.dispatchEvent(new CustomEvent("close"));
      });
      this._listenerAdded = true;
    }
  }

  disconnectedCallback() {
    document.body.style.overflow = "";
  }
}
