// Components are pre-registered via index.js (compiled by Rollup)

// Auto-detect input mask and placeholder based on type
const typeConfig = {
  text: { placeholder: "Enter text...", mask: null },
  email: { placeholder: "you@example.com", mask: null },
  password: { placeholder: "••••••••", mask: null },
  number: { placeholder: "0", mask: null },
  tel: { placeholder: "(555) 123-4567", mask: "phone" },
  url: { placeholder: "https://example.com", mask: null },
  search: { placeholder: "Search...", mask: null },
  date: { placeholder: "MM/DD/YYYY", mask: "datePicker" },
  time: { placeholder: "12:00 PM", mask: "time" },
  creditCard: { placeholder: "0000 0000 0000 0000", mask: "creditCard" },
  currency: { placeholder: "0.00", mask: "numeral" }
};

// Default helper and error text
const DEFAULT_HELP_TEXT =
  "This field provides additional context to help users understand what to enter.";
const DEFAULT_ERROR_TEXT = "Please check this field and try again.";

// Generate LWC source code from args
const generateSourceCode = (args) => {
  const config = typeConfig[args.type] || typeConfig.text;
  const attrs = [];

  // Label
  if (args.label) attrs.push(`label="${args.label}"`);

  // Type (only if not text)
  if (args.type && args.type !== "text") {
    attrs.push(`type="${args.type}"`);
  }

  // Placeholder (only if different from auto-detected)
  const autoPlaceholder = config.placeholder;
  if (args.placeholder && args.placeholder !== autoPlaceholder) {
    attrs.push(`placeholder="${args.placeholder}"`);
  }

  // Value
  if (args.value) attrs.push(`value="${args.value}"`);

  // Size (only if not default)
  if (args.size && args.size !== "md") attrs.push(`size="${args.size}"`);

  // Variant (only if dark)
  if (args.variant === "dark") attrs.push(`variant="dark"`);

  // Boolean attributes
  if (args.disabled) attrs.push("disabled");
  if (args.required) attrs.push("required");
  if (args.clearable) attrs.push("clearable");
  if (args.hideIcon) attrs.push("hide-icon");

  // Error state
  if (args.showError) {
    attrs.push("has-error");
    attrs.push(`error-message="${DEFAULT_ERROR_TEXT}"`);
  }

  // Help text
  if (args.showHelpText) {
    attrs.push(`help-text="${DEFAULT_HELP_TEXT}"`);
  }

  // Prefix/Suffix
  if (args.prefix) attrs.push(`prefix="${args.prefix}"`);
  if (args.suffix) attrs.push(`suffix="${args.suffix}"`);

  // Build the code string
  if (attrs.length === 0) {
    return `<c-procrewz-input></c-procrewz-input>`;
  }

  const attrStr = attrs.map((a) => `  ${a}`).join("\n");
  return `<c-procrewz-input\n${attrStr}\n></c-procrewz-input>`;
};

// Custom render function
const renderInput = (args) => {
  const element = document.createElement("c-procrewz-input");
  const processedArgs = { ...args };

  // Get type config
  const config = typeConfig[processedArgs.type] || typeConfig.text;

  // Auto-set placeholder if empty or default
  if (
    !processedArgs.placeholder ||
    processedArgs.placeholder === "Enter text..."
  ) {
    processedArgs.placeholder = config.placeholder;
  }

  // Auto-set input mask based on type
  if (config.mask && !processedArgs.inputMask) {
    processedArgs.inputMask = config.mask;
  }

  // Handle showHelpText toggle
  if (processedArgs.showHelpText) {
    processedArgs.helpText = DEFAULT_HELP_TEXT;
  } else {
    delete processedArgs.helpText;
  }
  delete processedArgs.showHelpText;

  // Handle showError toggle
  if (processedArgs.showError) {
    processedArgs.hasError = true;
    processedArgs.errorMessage = DEFAULT_ERROR_TEXT;
  } else {
    processedArgs.hasError = false;
    delete processedArgs.errorMessage;
  }
  delete processedArgs.showError;

  // Apply args to element
  Object.entries(processedArgs).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      element[key] = value;
    }
  });

  return element;
};

export default {
  component: "c-procrewz-input",
  title: "Components/Input",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      source: {
        // Transform source to show actual LWC code based on args
        transform: (code, storyContext) => generateSourceCode(storyContext.args)
      }
    }
  },
  argTypes: {
    // ============================================
    // CORE
    // ============================================
    label: {
      control: "text",
      description: "Label text displayed above the input",
      table: { category: "Core" }
    },
    type: {
      control: "select",
      options: [
        "text",
        "email",
        "password",
        "number",
        "tel",
        "url",
        "search",
        "date",
        "time",
        "creditCard",
        "currency"
      ],
      description: "Input type (automatically sets icon and mask)",
      table: { category: "Core" }
    },
    hideIcon: {
      control: "boolean",
      description: "Hide the auto-detected icon",
      table: { category: "Core" }
    },
    placeholder: {
      control: "text",
      description: "Placeholder text (auto-detected from type)",
      table: { category: "Core" }
    },
    value: {
      control: "text",
      description: "Current input value",
      table: { category: "Core" }
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Input field size",
      table: { category: "Core" }
    },
    variant: {
      control: "select",
      options: ["light", "dark"],
      description: "Visual theme",
      table: { category: "Core" }
    },

    // ============================================
    // STATES
    // ============================================
    disabled: {
      control: "boolean",
      description: "Disable the input",
      table: { category: "States" }
    },
    required: {
      control: "boolean",
      description: "Mark field as required",
      table: { category: "States" }
    },
    clearable: {
      control: "boolean",
      description: "Show clear button when input has value",
      table: { category: "States" }
    },

    // ============================================
    // ERROR
    // ============================================
    showError: {
      control: "boolean",
      description: "Show error state with default message",
      table: { category: "Error" }
    },

    // ============================================
    // HELP TEXT
    // ============================================
    showHelpText: {
      control: "boolean",
      description: "Show helper text below input",
      table: { category: "Help" }
    },

    // ============================================
    // ADDONS
    // ============================================
    prefix: {
      control: "text",
      description: "Text/symbol before input (e.g., '$', 'https://')",
      table: { category: "Addons" }
    },
    suffix: {
      control: "text",
      description: "Text/symbol after input (e.g., '@company.com', 'USD')",
      table: { category: "Addons" }
    }
  },
  render: renderInput
};

// Default args
const defaultArgs = {
  label: "Label",
  type: "text",
  placeholder: "",
  value: "",
  size: "md",
  variant: "light",
  prefix: "",
  suffix: "",
  disabled: false,
  required: false,
  clearable: false,
  showError: false,
  showHelpText: false,
  hideIcon: false
};

// ============================================
// MAIN STORIES
// ============================================

export const Default = {
  args: { ...defaultArgs },
  parameters: {
    docs: {
      description: {
        story:
          "Basic input field. Change the controls to see the code update dynamically."
      }
    }
  }
};

export const WithLabel = {
  args: {
    ...defaultArgs,
    label: "Email Address",
    type: "email"
  },
  parameters: {
    docs: {
      description: {
        story: "Input with label. Email type automatically shows email icon."
      }
    }
  }
};

export const Required = {
  args: {
    ...defaultArgs,
    label: "Full Name",
    required: true
  },
  parameters: {
    docs: {
      description: {
        story: "Required field displays an asterisk indicator."
      }
    }
  }
};

export const WithHelperText = {
  args: {
    ...defaultArgs,
    label: "Password",
    type: "password",
    showHelpText: true
  },
  parameters: {
    docs: {
      description: {
        story: "Toggle helper text to provide additional context."
      }
    }
  }
};

export const ErrorState = {
  args: {
    ...defaultArgs,
    label: "Email",
    type: "email",
    value: "invalid-email",
    showError: true
  },
  parameters: {
    docs: {
      description: {
        story: "Error state with automatic error message display."
      }
    }
  }
};

export const Disabled = {
  args: {
    ...defaultArgs,
    label: "Disabled Field",
    value: "Cannot edit this",
    disabled: true
  },
  parameters: {
    docs: {
      description: {
        story: "Disabled inputs cannot be edited."
      }
    }
  }
};

// ============================================
// SIZE STORIES
// ============================================

export const Small = {
  args: {
    ...defaultArgs,
    label: "Small",
    size: "sm"
  }
};

export const Medium = {
  args: {
    ...defaultArgs,
    label: "Medium (Default)",
    size: "md"
  }
};

export const Large = {
  args: {
    ...defaultArgs,
    label: "Large",
    size: "lg"
  }
};

// ============================================
// ADDON STORIES
// ============================================

export const WithPrefix = {
  args: {
    ...defaultArgs,
    label: "Website",
    type: "url",
    prefix: "https://"
  },
  parameters: {
    docs: {
      description: {
        story: "Prefix text appears before the input field."
      }
    }
  }
};

export const WithSuffix = {
  args: {
    ...defaultArgs,
    label: "Email",
    suffix: "@company.com"
  },
  parameters: {
    docs: {
      description: {
        story: "Suffix text appears after the input field."
      }
    }
  }
};

export const WithPrefixAndSuffix = {
  args: {
    ...defaultArgs,
    label: "Price",
    type: "currency",
    prefix: "$",
    suffix: "USD"
  },
  parameters: {
    docs: {
      description: {
        story: "Both prefix and suffix can be used together."
      }
    }
  }
};

// ============================================
// CLEARABLE STORIES
// ============================================

export const Clearable = {
  args: {
    ...defaultArgs,
    label: "Search",
    type: "search",
    value: "Hello World",
    clearable: true
  },
  parameters: {
    docs: {
      description: {
        story: "Clearable inputs show an X button when there's a value."
      }
    }
  }
};

// ============================================
// INPUT TYPE STORIES (Auto-masked)
// ============================================

export const Password = {
  args: {
    ...defaultArgs,
    label: "Password",
    type: "password"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Password type shows visibility toggle icon. Click to show/hide password."
      }
    }
  }
};

export const Phone = {
  args: {
    ...defaultArgs,
    label: "Phone Number",
    type: "tel"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Phone type automatically masks input as (XXX) XXX-XXXX and shows phone icon."
      }
    }
  }
};

export const DatePicker = {
  args: {
    ...defaultArgs,
    label: "Date",
    type: "date"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Date type provides MM/DD/YYYY masking with a calendar dropdown. Type or click the calendar icon."
      }
    }
  }
};

export const TimePicker = {
  args: {
    ...defaultArgs,
    label: "Time",
    type: "time"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Time type provides a time picker dropdown. Type or click the clock icon."
      }
    }
  }
};

export const CreditCard = {
  args: {
    ...defaultArgs,
    label: "Card Number",
    type: "creditCard"
  },
  parameters: {
    docs: {
      description: {
        story: "Credit card type auto-formats card numbers and shows card icon."
      }
    }
  }
};

export const Currency = {
  args: {
    ...defaultArgs,
    label: "Amount",
    type: "currency",
    prefix: "$"
  },
  parameters: {
    docs: {
      description: {
        story: "Currency type formats numbers with thousands separators."
      }
    }
  }
};

// ============================================
// DARK THEME
// ============================================

export const DarkTheme = {
  args: {
    ...defaultArgs,
    label: "Dark Theme Input",
    type: "email",
    variant: "dark"
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story: "Input in dark theme mode."
      }
    }
  }
};

export const DatePickerDark = {
  args: {
    ...defaultArgs,
    label: "Select Date",
    type: "date",
    variant: "dark"
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story: "Date picker in dark theme."
      }
    }
  }
};
