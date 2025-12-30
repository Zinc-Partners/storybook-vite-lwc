// Components are pre-registered via index.js (compiled by Rollup)
// No imports needed - just use the custom element tags

// Default args
const defaultArgs = {
  title: "Modal Title",
  size: "medium",
  hideCloseButton: false,
  footerButtons: 2 // 0 = none, 1 = primary only, 2 = primary + cancel, 3 = primary + secondary + cancel
};

// Custom render function for modal (needs trigger button)
const renderModal = (args) => {
  const container = document.createElement("div");
  container.style.cssText =
    "display: flex; justify-content: center; align-items: center; min-height: 400px;";

  // Create trigger button using procrewzButton
  const triggerButton = document.createElement("c-procrewz-button");
  triggerButton.label = "Open Modal";
  triggerButton.variant = "primary";
  triggerButton.size = "medium";

  // Create modal element
  const modal = document.createElement("c-procrewz-modal");

  // Set modal properties (exclude footerButtons as it's not a modal prop)
  Object.entries(args).forEach(([key, value]) => {
    if (value !== undefined && value !== null && key !== "footerButtons") {
      modal[key] = value;
    }
  });

  // Add content to modal
  const content = document.createElement("div");
  content.innerHTML = `
    <p style="margin: 0 0 16px 0; color: var(--color-text-default, #111827);">
      This is a modal dialog with smooth enter/exit animations using the native 
      <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 13px;">&lt;dialog&gt;</code> 
      element and CSS <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 13px;">@starting-style</code>.
    </p>
     <p style="margin: 0 0 16px 0; color: var(--color-text-default, #111827);">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
    
    <p style="margin: 0; color: var(--color-text-muted, #6b7280);">
      Click outside the modal or press Escape to close.
    </p>
  `;
  modal.appendChild(content);

  // Add footer buttons based on footerButtons arg
  const footerButtonCount = args.footerButtons || 0;

  if (footerButtonCount > 0) {
    const footer = document.createElement("div");
    footer.slot = "footer";
    footer.style.cssText =
      "display: flex; justify-content: space-between; align-items: center; width: 100%;";

    // Left side - Cancel button (appears for 2+ buttons)
    const leftGroup = document.createElement("div");
    if (footerButtonCount >= 2) {
      const cancelBtn = document.createElement("c-procrewz-button");
      cancelBtn.label = "Cancel";
      cancelBtn.variant = "secondary";
      cancelBtn.size = "medium";
      cancelBtn.addEventListener("click", () => modal.close());
      leftGroup.appendChild(cancelBtn);
    }
    footer.appendChild(leftGroup);

    // Right side - Secondary and Primary buttons
    const rightGroup = document.createElement("div");
    rightGroup.style.cssText = "display: flex; gap: 12px;";

    // Secondary button (appears for 3 buttons)
    if (footerButtonCount >= 3) {
      const secondaryBtn = document.createElement("c-procrewz-button");
      secondaryBtn.label = "Save Draft";
      secondaryBtn.variant = "secondary";
      secondaryBtn.size = "medium";
      secondaryBtn.addEventListener("click", () => {
        console.log("Secondary action clicked");
      });
      rightGroup.appendChild(secondaryBtn);
    }

    // Primary button (always appears when footerButtons > 0)
    const primaryBtn = document.createElement("c-procrewz-button");
    primaryBtn.label = "Confirm";
    primaryBtn.variant = "primary";
    primaryBtn.size = "medium";
    primaryBtn.addEventListener("click", () => {
      console.log("Primary action clicked");
      modal.close();
    });
    rightGroup.appendChild(primaryBtn);

    footer.appendChild(rightGroup);
    modal.appendChild(footer);
  }

  // Connect trigger to modal
  triggerButton.addEventListener("click", () => {
    modal.open();
  });

  // Listen for modal events
  modal.addEventListener("open", () => console.log("Modal opened"));
  modal.addEventListener("close", () => console.log("Modal closed"));

  container.appendChild(triggerButton);
  container.appendChild(modal);

  return container;
};

export default {
  title: "Components/Modal",
  component: "c-procrewz-modal",
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Modal title displayed in the header",
      table: { category: "Content" }
    },
    size: {
      control: "select",
      options: ["small", "medium", "large", "full"],
      description: "Modal width size",
      table: { category: "Appearance" }
    },
    hideCloseButton: {
      control: "boolean",
      description: "Hide the close button in the header",
      table: { category: "Behavior" }
    },
    footerButtons: {
      control: { type: "select" },
      options: [0, 1, 2, 3],
      description:
        "Number of footer buttons: 0=none, 1=primary, 2=primary+cancel, 3=primary+secondary+cancel",
      table: {
        category: "Footer",
        type: { summary: "number" }
      }
    }
  },
  args: defaultArgs,
  render: renderModal,
  parameters: {
    docs: {
      description: {
        component: `
A modal dialog component built with the native \`<dialog>\` element.

## Features
- Smooth enter/exit animations using \`@starting-style\`
- Backdrop click to close
- Escape key to close
- Focus trap (native dialog behavior)
- Accessibility support with ARIA attributes
- Multiple size variants

## Usage in Salesforce LWC

\`\`\`html
<!-- Parent component template -->
<template>
  <c-procrewz-button label="Open Modal" onclick={handleOpenModal}></c-procrewz-button>
  
  <c-procrewz-modal 
    title="Confirm Action" 
    size="small"
    onclose={handleModalClose}
  >
    <p>Are you sure you want to continue?</p>
    
    <div slot="footer">
      <c-procrewz-button label="Cancel" variant="secondary" onclick={handleCancel}></c-procrewz-button>
      <c-procrewz-button label="Confirm" variant="primary" onclick={handleConfirm}></c-procrewz-button>
    </div>
  </c-procrewz-modal>
</template>
\`\`\`

\`\`\`javascript
// Parent component JS
import { LightningElement } from 'lwc';

export default class MyComponent extends LightningElement {
  handleOpenModal() {
    this.template.querySelector('c-procrewz-modal').open();
  }
  
  handleModalClose() {
    console.log('Modal closed');
  }
  
  handleCancel() {
    this.template.querySelector('c-procrewz-modal').close();
  }
  
  handleConfirm() {
    // Do something
    this.template.querySelector('c-procrewz-modal').close();
  }
}
\`\`\`
        `
      },
      source: {
        code: `<c-procrewz-modal 
  title="Modal Title" 
  size="medium"
  onclose={handleClose}
>
  <p>Modal content goes here</p>
  
  <div slot="footer">
    <c-procrewz-button label="Cancel" variant="secondary"></c-procrewz-button>
    <c-procrewz-button label="Confirm" variant="primary"></c-procrewz-button>
  </div>
</c-procrewz-modal>`
      }
    }
  }
};

// Stories
export const Default = {
  args: defaultArgs
};

export const Small = {
  args: {
    ...defaultArgs,
    title: "Small Modal",
    size: "small"
  },
  parameters: {
    docs: {
      description: {
        story: "400px width - ideal for confirmations and simple forms."
      }
    }
  }
};

export const Medium = {
  args: {
    ...defaultArgs,
    title: "Medium Modal",
    size: "medium"
  },
  parameters: {
    docs: {
      description: { story: "560px width - default size for most use cases." }
    }
  }
};

export const Large = {
  args: {
    ...defaultArgs,
    title: "Large Modal",
    size: "large"
  },
  parameters: {
    docs: {
      description: {
        story: "720px width - for complex forms and detailed content."
      }
    }
  }
};

export const FullWidth = {
  args: {
    ...defaultArgs,
    title: "Full Width Modal",
    size: "full"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Full viewport width (minus padding) - for data tables and rich content."
      }
    }
  }
};

export const NoTitle = {
  args: {
    ...defaultArgs,
    title: "",
    size: "small"
  },
  parameters: {
    docs: {
      description: {
        story: "Modal without a title - close button still appears."
      }
    }
  }
};

export const NoCloseButton = {
  args: {
    ...defaultArgs,
    title: "Blocking Modal",
    hideCloseButton: true
  },
  parameters: {
    docs: {
      description: {
        story:
          "Modal without close button - user must interact with content to dismiss. Still closable via Escape key and backdrop click."
      }
    }
  }
};

export const WithPrimaryButton = {
  args: {
    ...defaultArgs,
    title: "Confirmation",
    size: "small",
    footerButtons: 1
  },
  parameters: {
    docs: {
      description: { story: "Modal with a single primary action button." }
    }
  }
};

export const WithTwoButtons = {
  args: {
    ...defaultArgs,
    title: "Confirm Action",
    size: "small",
    footerButtons: 2
  },
  parameters: {
    docs: {
      description: {
        story:
          "Modal with primary and cancel buttons - the most common pattern."
      }
    }
  }
};

export const WithThreeButtons = {
  args: {
    ...defaultArgs,
    title: "Save Changes",
    size: "medium",
    footerButtons: 3
  },
  parameters: {
    docs: {
      description: {
        story: "Modal with primary, secondary (Save Draft), and cancel buttons."
      }
    }
  }
};

// All Variants showcase
export const AllSizes = {
  render: () => {
    const container = document.createElement("div");
    container.style.cssText = "display: flex; gap: 12px; flex-wrap: wrap;";

    const sizes = ["small", "medium", "large", "full"];

    sizes.forEach((size) => {
      const wrapper = document.createElement("div");

      const button = document.createElement("c-procrewz-button");
      button.label = `${size.charAt(0).toUpperCase() + size.slice(1)} Modal`;
      button.variant = "secondary";
      button.size = "medium";

      const modal = document.createElement("c-procrewz-modal");
      modal.title = `${size.charAt(0).toUpperCase() + size.slice(1)} Modal`;
      modal.size = size;

      const content = document.createElement("p");
      content.textContent = `This is a ${size} modal (${size === "small" ? "400px" : size === "medium" ? "560px" : size === "large" ? "720px" : "full width"}).`;
      content.style.margin = "0";
      modal.appendChild(content);

      button.addEventListener("click", () => modal.open());

      wrapper.appendChild(button);
      wrapper.appendChild(modal);
      container.appendChild(wrapper);
    });

    return container;
  },
  parameters: {
    docs: {
      description: { story: "All modal size variants." }
    }
  }
};
