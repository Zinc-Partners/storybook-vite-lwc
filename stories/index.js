/*
 * This file imports all LWC components and registers them as custom elements
 * for use in Storybook stories.
 *
 * NOTE: Only register top-level components that Storybook renders directly.
 * Child components (like themeProvider used inside procrewzButton) are
 * handled internally by LWC and should NOT be registered here.
 */

// Import only the top-level components that stories render
import ProcrewzButton from "c/procrewzButton";
import ProcrewzModal from "c/procrewzModal";
import ProcrewzInput from "c/procrewzInput";

// Helper function to register components
export function registerLWC() {
  function buildAndRegisterCustomElement(elementName, elementClass) {
    if (!customElements.get(elementName)) {
      customElements.define(elementName, elementClass.CustomElementConstructor);
    }
  }

  // Only register components that are directly rendered by Storybook
  // DO NOT register child components like c-theme-provider - LWC handles those
  buildAndRegisterCustomElement("c-procrewz-button", ProcrewzButton);
  buildAndRegisterCustomElement("c-procrewz-modal", ProcrewzModal);
  buildAndRegisterCustomElement("c-procrewz-input", ProcrewzInput);
}
