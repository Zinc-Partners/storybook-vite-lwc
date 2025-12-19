// Components are pre-registered via index.js (compiled by Rollup)
// No imports needed - just use the custom element tags

// Custom render function
const renderInput = (args) => {
  const element = document.createElement("c-procrewz-input");

  Object.entries(args).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
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
    layout: "centered"
  },
  argTypes: {
    // Core
    label: { control: "text", description: "Label text" },
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url", "search"],
      description: "Input type"
    },
    placeholder: { control: "text", description: "Placeholder text" },
    value: { control: "text", description: "Input value" },
    name: { control: "text", description: "Input name" },

    // Size
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Input size"
    },

    // Prefix/Suffix
    prefix: {
      control: "text",
      description: "Text/symbol before input",
      table: { category: "Addons" }
    },
    suffix: {
      control: "text",
      description: "Text/symbol after input",
      table: { category: "Addons" }
    },

    // States
    disabled: { control: "boolean", description: "Disabled state" },
    required: { control: "boolean", description: "Required field" },
    readonly: { control: "boolean", description: "Read-only state" },
    hasError: { control: "boolean", description: "Error state" },
    clearable: { control: "boolean", description: "Show clear button" },

    // Text
    helpText: { control: "text", description: "Helper text below input" },
    errorMessage: {
      control: "text",
      description: "Error message (when hasError)"
    },

    // Visual
    hideLabel: { control: "boolean", description: "Visually hide label" },
    requiredIndicator: {
      control: "text",
      description: "Required indicator symbol"
    },

    // Icons
    icon: {
      control: "select",
      options: [
        "",
        "search",
        "email",
        "calendar",
        "creditCard",
        "phone",
        "clock"
      ],
      description: "Suffix icon (auto-detected if not set)",
      table: { category: "Icons" }
    },
    hideIcon: {
      control: "boolean",
      description: "Hide auto-detected icon",
      table: { category: "Icons" }
    },

    // Masking
    inputMask: {
      control: "select",
      options: ["", "phone", "creditCard", "date", "time", "numeral"],
      description: "Input mask type",
      table: { category: "Masking" }
    }
  },
  render: renderInput
};

// Default args
const defaultArgs = {
  label: "",
  type: "text",
  placeholder: "Enter text...",
  value: "",
  name: "input-field",
  size: "md",
  prefix: "",
  suffix: "",
  helpText: "",
  errorMessage: "",
  disabled: false,
  required: false,
  readonly: false,
  hasError: false,
  clearable: false,
  hideLabel: false,
  requiredIndicator: "*",
  inputMask: "",
  icon: "",
  hideIcon: false
};

// ============================================
// BASIC STORIES
// ============================================

export const Default = {
  args: { ...defaultArgs, placeholder: "Enter text..." },
  parameters: {
    docs: {
      source: {
        code: `<!-- Basic Usage -->
<c-procrewz-input 
  placeholder="Enter text..."
  onchange={handleChange}
></c-procrewz-input>

<!-- JS Controller -->
handleChange(event) {
  console.log('Value:', event.detail.value);
  console.log('Name:', event.detail.name);
}`
      }
    }
  }
};

export const WithLabel = {
  args: {
    ...defaultArgs,
    label: "Email Address",
    type: "email",
    placeholder: "you@example.com"
  },
  parameters: {
    docs: {
      source: {
        code: `<c-procrewz-input 
  label="Email Address" 
  type="email" 
  placeholder="you@example.com"
  name="email"
  onchange={handleEmailChange}
></c-procrewz-input>`
      }
    }
  }
};

export const Required = {
  args: {
    ...defaultArgs,
    label: "Full Name",
    placeholder: "John Doe",
    required: true
  },
  parameters: {
    docs: {
      source: {
        code: `<c-procrewz-input 
  label="Full Name" 
  placeholder="John Doe" 
  name="fullName"
  required
></c-procrewz-input>`
      }
    }
  }
};

export const WithHelperText = {
  args: {
    ...defaultArgs,
    label: "Password",
    type: "password",
    placeholder: "••••••••",
    helpText: "Must be at least 8 characters"
  },
  parameters: {
    docs: {
      source: {
        code: `<c-procrewz-input 
  label="Password" 
  type="password" 
  placeholder="••••••••"
  help-text="Must be at least 8 characters"
></c-procrewz-input>`
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
    hasError: true,
    errorMessage: "Please enter a valid email address"
  },
  parameters: {
    docs: {
      source: {
        code: `<!-- Error State (controlled by JS) -->
<c-procrewz-input 
  label="Email" 
  type="email"
  value={email}
  has-error={hasEmailError}
  error-message={emailErrorMessage}
  onchange={handleEmailChange}
></c-procrewz-input>

<!-- JS Controller -->
email = '';
hasEmailError = false;
emailErrorMessage = '';

handleEmailChange(event) {
  this.email = event.detail.value;
  
  // Validate email
  const isValid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(this.email);
  this.hasEmailError = !isValid && this.email.length > 0;
  this.emailErrorMessage = this.hasEmailError 
    ? 'Please enter a valid email address' 
    : '';
}`
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
      source: {
        code: `<c-procrewz-input 
  label="Disabled Field" 
  value="Cannot edit this" 
  disabled
></c-procrewz-input>`
      }
    }
  }
};

export const ReadOnly = {
  args: {
    ...defaultArgs,
    label: "Account ID",
    value: "ACC-12345-XYZ",
    readonly: true
  },
  parameters: {
    docs: {
      source: {
        code: `<c-procrewz-input 
  label="Account ID" 
  value={record.AccountId} 
  readonly
></c-procrewz-input>`
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
    label: "Small Input",
    placeholder: "Small size",
    size: "sm"
  },
  parameters: {
    docs: {
      source: {
        code: `<c-procrewz-input label="Small" size="sm"></c-procrewz-input>`
      }
    }
  }
};

export const Medium = {
  args: {
    ...defaultArgs,
    label: "Medium Input",
    placeholder: "Medium size (default)",
    size: "md"
  },
  parameters: {
    docs: {
      source: {
        code: `<c-procrewz-input label="Medium" size="md"></c-procrewz-input>`
      }
    }
  }
};

export const Large = {
  args: {
    ...defaultArgs,
    label: "Large Input",
    placeholder: "Large size",
    size: "lg"
  },
  parameters: {
    docs: {
      source: {
        code: `<c-procrewz-input label="Large" size="lg"></c-procrewz-input>`
      }
    }
  }
};

// ============================================
// ICON STORIES (Auto-detected based on type/mask)
// ============================================

export const EmailWithIcon = {
  args: {
    ...defaultArgs,
    label: "Email",
    type: "email",
    placeholder: "you@example.com"
  },
  parameters: {
    docs: {
      description: { story: 'Email icon is auto-detected from `type="email"`' },
      source: {
        code: `<!-- Icon auto-detected from type="email" -->
<c-procrewz-input 
  label="Email" 
  type="email" 
  placeholder="you@example.com"
></c-procrewz-input>

<!-- Disable auto icon -->
<c-procrewz-input 
  label="Email" 
  type="email" 
  show-icon="false"
></c-procrewz-input>`
      }
    }
  }
};

export const SearchWithIcon = {
  args: {
    ...defaultArgs,
    label: "Search",
    type: "search",
    placeholder: "Search...",
    clearable: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Search icon is auto-detected from `type="search"`'
      },
      source: {
        code: `<c-procrewz-input 
  label="Search" 
  type="search" 
  placeholder="Search..."
  clearable
></c-procrewz-input>`
      }
    }
  }
};

export const PhoneWithIcon = {
  args: {
    ...defaultArgs,
    label: "Phone",
    inputMask: "phone",
    placeholder: "(555) 123-4567"
  },
  parameters: {
    docs: {
      description: {
        story: 'Phone icon is auto-detected from `input-mask="phone"`'
      },
      source: {
        code: `<c-procrewz-input 
  label="Phone" 
  input-mask="phone" 
  placeholder="(555) 123-4567"
></c-procrewz-input>`
      }
    }
  }
};

export const CreditCardWithIcon = {
  args: {
    ...defaultArgs,
    label: "Card Number",
    inputMask: "creditCard",
    placeholder: "0000 0000 0000 0000"
  },
  parameters: {
    docs: {
      description: {
        story:
          'Credit card icon is auto-detected from `input-mask="creditCard"`'
      },
      source: {
        code: `<c-procrewz-input 
  label="Card Number" 
  input-mask="creditCard" 
  placeholder="0000 0000 0000 0000"
></c-procrewz-input>`
      }
    }
  }
};

export const DateWithIcon = {
  args: {
    ...defaultArgs,
    label: "Date",
    inputMask: "date",
    placeholder: "MM/DD/YYYY"
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar icon is auto-detected from `input-mask="date"`'
      },
      source: {
        code: `<c-procrewz-input 
  label="Date" 
  input-mask="date" 
  placeholder="MM/DD/YYYY"
></c-procrewz-input>`
      }
    }
  }
};

export const ExplicitIcon = {
  args: {
    ...defaultArgs,
    label: "Custom Icon",
    placeholder: "With explicit icon",
    icon: "search"
  },
  parameters: {
    docs: {
      description: {
        story: "You can explicitly set any icon regardless of type"
      },
      source: {
        code: `<!-- Explicitly set icon -->
<c-procrewz-input 
  label="Custom" 
  icon="search"
></c-procrewz-input>

<!-- Available icons: search, email, calendar, creditCard, phone -->`
      }
    }
  }
};

export const NoIcon = {
  args: {
    ...defaultArgs,
    label: "Email (No Icon)",
    type: "email",
    placeholder: "you@example.com",
    hideIcon: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Disable auto-detected icons with `show-icon="false"`'
      },
      source: {
        code: `<c-procrewz-input 
  label="Email" 
  type="email" 
  show-icon="false"
></c-procrewz-input>`
      }
    }
  }
};

// ============================================
// PREFIX/SUFFIX STORIES
// ============================================

export const WithPrefix = {
  args: {
    ...defaultArgs,
    label: "Website",
    placeholder: "example.com",
    prefix: "https://"
  },
  parameters: {
    docs: {
      source: {
        code: `<c-procrewz-input 
  label="Website" 
  placeholder="example.com" 
  prefix="https://"
></c-procrewz-input>`
      }
    }
  }
};

export const WithSuffix = {
  args: {
    ...defaultArgs,
    label: "Email",
    placeholder: "username",
    suffix: "@company.com"
  },
  parameters: {
    docs: {
      source: {
        code: `<c-procrewz-input 
  label="Email" 
  placeholder="username" 
  suffix="@company.com"
></c-procrewz-input>`
      }
    }
  }
};

export const WithPrefixAndSuffix = {
  args: {
    ...defaultArgs,
    label: "Price",
    type: "number",
    placeholder: "0.00",
    prefix: "$",
    suffix: "USD"
  },
  parameters: {
    docs: {
      source: {
        code: `<c-procrewz-input 
  label="Price" 
  type="number" 
  placeholder="0.00"
  prefix="$" 
  suffix="USD"
></c-procrewz-input>`
      }
    }
  }
};

export const CurrencyInput = {
  args: {
    ...defaultArgs,
    label: "Amount",
    type: "number",
    placeholder: "0.00",
    prefix: "$",
    size: "lg"
  },
  parameters: {
    docs: {
      source: {
        code: `<c-procrewz-input 
  label="Amount" 
  type="number" 
  placeholder="0.00"
  prefix="$" 
  size="lg"
></c-procrewz-input>`
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
    placeholder: "Type to search...",
    value: "Hello World",
    clearable: true
  },
  parameters: {
    docs: {
      source: {
        code: `<!-- Salesforce LWC Usage -->
<c-procrewz-input 
  label="Search" 
  placeholder="Type to search..."
  value={searchValue}
  clearable
  onchange={handleSearchChange}
  onclear={handleSearchClear}
></c-procrewz-input>

<!-- JS Controller -->
searchValue = '';

handleSearchChange(event) {
  this.searchValue = event.detail.value;
  // Trigger search...
}

handleSearchClear(event) {
  this.searchValue = '';
  console.log('Search cleared');
}`
      }
    }
  }
};

export const ClearableWithSuffix = {
  args: {
    ...defaultArgs,
    label: "Email",
    placeholder: "username",
    value: "john",
    suffix: "@example.com",
    clearable: true
  },
  parameters: {
    docs: {
      source: {
        code: `<c-procrewz-input 
  label="Email" 
  placeholder="username"
  value={username}
  suffix="@example.com" 
  clearable
  onchange={handleUsernameChange}
></c-procrewz-input>`
      }
    }
  }
};

// ============================================
// INPUT TYPE STORIES
// ============================================

export const Password = {
  args: {
    ...defaultArgs,
    label: "Password",
    type: "password",
    placeholder: "Enter password"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Password inputs automatically show a visibility toggle button (eye icon). Click the icon to toggle between showing and hiding the password."
      },
      source: {
        code: `<!-- Password with visibility toggle -->
<c-procrewz-input 
  label="Password" 
  type="password"
  placeholder="Enter password"
></c-procrewz-input>

<!-- Hide the visibility toggle if needed -->
<c-procrewz-input 
  label="Password" 
  type="password"
  placeholder="Enter password"
  hide-icon
></c-procrewz-input>`
      }
    }
  }
};

export const Number = {
  args: {
    ...defaultArgs,
    label: "Quantity",
    type: "number",
    placeholder: "0",
    min: "0",
    max: "100"
  },
  parameters: {
    docs: {
      source: {
        code: `<c-procrewz-input label="Quantity" type="number" min="0" max="100"></c-procrewz-input>`
      }
    }
  }
};

export const Search = {
  args: {
    ...defaultArgs,
    type: "search",
    placeholder: "Search...",
    clearable: true
  },
  parameters: {
    docs: {
      source: {
        code: `<c-procrewz-input type="search" placeholder="Search..." clearable></c-procrewz-input>`
      }
    }
  }
};

export const Tel = {
  args: {
    ...defaultArgs,
    label: "Phone Number",
    type: "tel",
    placeholder: "(555) 123-4567"
  },
  parameters: {
    docs: {
      source: {
        code: `<c-procrewz-input label="Phone" type="tel" placeholder="(555) 123-4567"></c-procrewz-input>`
      }
    }
  }
};

// ============================================
// INPUT MASKING STORIES
// ============================================

export const PhoneMask = {
  args: {
    ...defaultArgs,
    label: "Phone Number",
    placeholder: "(555) 123-4567",
    inputMask: "phone"
  },
  parameters: {
    docs: {
      description: {
        story: "Automatically formats as US phone number: (XXX) XXX-XXXX"
      },
      source: {
        code: `<!-- Salesforce LWC Usage -->
<c-procrewz-input 
  label="Phone Number" 
  placeholder="(555) 123-4567"
  input-mask="phone"
  onchange={handlePhoneChange}
></c-procrewz-input>

<!-- JS Controller -->
handlePhoneChange(event) {
  const formattedValue = event.detail.value;    // (555) 123-4567
  const rawValue = event.detail.rawValue;       // 5551234567
  console.log('Phone:', rawValue);
}`
      }
    }
  }
};

export const CreditCardMask = {
  args: {
    ...defaultArgs,
    label: "Card Number",
    placeholder: "0000 0000 0000 0000",
    inputMask: "creditCard"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Auto-detects card type (Visa, Amex, Mastercard) and formats accordingly"
      },
      source: {
        code: `<!-- Salesforce LWC Usage -->
<c-procrewz-input 
  label="Card Number" 
  placeholder="0000 0000 0000 0000"
  input-mask="creditCard"
  onchange={handleCardChange}
></c-procrewz-input>

<!-- JS Controller -->
handleCardChange(event) {
  const formattedValue = event.detail.value;    // 4242 4242 4242 4242
  const rawValue = event.detail.rawValue;       // 4242424242424242
  console.log('Card:', rawValue);
}`
      }
    }
  }
};

export const DateMask = {
  args: {
    ...defaultArgs,
    label: "Date of Birth",
    placeholder: "MM/DD/YYYY",
    inputMask: "date"
  },
  parameters: {
    docs: {
      description: { story: "Formats as MM/DD/YYYY with automatic validation" },
      source: {
        code: `<!-- Salesforce LWC Usage -->
<c-procrewz-input 
  label="Date of Birth" 
  placeholder="MM/DD/YYYY"
  input-mask="date"
  onchange={handleDateChange}
></c-procrewz-input>

<!-- JS Controller -->
handleDateChange(event) {
  const formattedValue = event.detail.value;    // 12/25/2024
  const rawValue = event.detail.rawValue;       // 12252024
  console.log('Date:', rawValue);
}`
      }
    }
  }
};

export const TimeMask = {
  args: {
    ...defaultArgs,
    label: "Time",
    placeholder: "HH:MM",
    inputMask: "time"
  },
  parameters: {
    docs: {
      description: { story: "Formats as HH:MM (24-hour format)" },
      source: {
        code: `<!-- Salesforce LWC Usage -->
<c-procrewz-input 
  label="Appointment Time" 
  placeholder="HH:MM"
  input-mask="time"
  onchange={handleTimeChange}
></c-procrewz-input>

<!-- JS Controller -->
handleTimeChange(event) {
  const formattedValue = event.detail.value;    // 14:30
  const rawValue = event.detail.rawValue;       // 1430
  console.log('Time:', rawValue);
}`
      }
    }
  }
};

export const NumeralMask = {
  args: {
    ...defaultArgs,
    label: "Amount",
    placeholder: "0",
    prefix: "$",
    inputMask: "numeral"
  },
  parameters: {
    docs: {
      description: {
        story: "Formats numbers with thousands separators (1,234,567)"
      },
      source: {
        code: `<!-- Salesforce LWC Usage -->
<c-procrewz-input 
  label="Amount" 
  placeholder="0"
  prefix="$"
  input-mask="numeral"
  onchange={handleAmountChange}
></c-procrewz-input>

<!-- JS Controller -->
handleAmountChange(event) {
  const formattedValue = event.detail.value;    // $1,234,567
  const rawValue = event.detail.rawValue;       // 1234567
  console.log('Amount:', rawValue);
}`
      }
    }
  }
};

// ============================================
// HIDDEN LABEL STORY
// ============================================

export const HiddenLabel = {
  args: {
    ...defaultArgs,
    label: "Search (hidden)",
    placeholder: "Search...",
    hideLabel: true
  },
  parameters: {
    docs: {
      description: {
        story:
          "Label is visually hidden but still available for screen readers via aria-label."
      },
      source: {
        code: `<c-procrewz-input label="Search" placeholder="Search..." hide-label></c-procrewz-input>`
      }
    }
  }
};

// ============================================
// ALL VARIANTS SHOWCASE
// ============================================

export const AllVariants = {
  render: () => {
    const container = document.createElement("div");
    container.innerHTML = `
      <style>
        .showcase {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          max-width: 400px;
        }
        .showcase h3 {
          margin: 0 0 1rem 0;
          color: #374151;
          font-size: 1rem;
          font-weight: 600;
        }
        .section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
      </style>
      <div class="showcase">
        <div>
          <h3>Sizes</h3>
          <div class="section">
            <c-procrewz-input label="Small" placeholder="Small input" size="sm"></c-procrewz-input>
            <c-procrewz-input label="Medium" placeholder="Medium input (default)" size="md"></c-procrewz-input>
            <c-procrewz-input label="Large" placeholder="Large input" size="lg"></c-procrewz-input>
          </div>
        </div>
        
        <div>
          <h3>Prefix & Suffix</h3>
          <div class="section">
            <c-procrewz-input label="Website" placeholder="example.com" prefix="https://" size="md"></c-procrewz-input>
            <c-procrewz-input label="Email" placeholder="username" suffix="@company.com" size="md"></c-procrewz-input>
            <c-procrewz-input label="Price" type="number" placeholder="0.00" prefix="$" suffix="USD" size="md"></c-procrewz-input>
          </div>
        </div>
        
        <div>
          <h3>Clearable</h3>
          <div class="section" id="clearable-section"></div>
        </div>
        
        <div>
          <h3>States</h3>
          <div class="section">
            <c-procrewz-input label="Default" placeholder="Enter text..." size="md"></c-procrewz-input>
            <c-procrewz-input label="Disabled" value="Disabled input" disabled size="md"></c-procrewz-input>
            <c-procrewz-input label="Read Only" value="Read only value" readonly size="md"></c-procrewz-input>
            <c-procrewz-input label="With Helper" placeholder="Enter email" help-text="We'll never share your email" size="md"></c-procrewz-input>
            <c-procrewz-input label="Error State" value="bad@" has-error error-message="Invalid email format" size="md"></c-procrewz-input>
          </div>
        </div>
        
        <div>
          <h3>Input Types</h3>
          <div class="section">
            <c-procrewz-input label="Email" type="email" placeholder="you@example.com" size="md"></c-procrewz-input>
            <c-procrewz-input label="Password" type="password" placeholder="••••••••" size="md"></c-procrewz-input>
            <c-procrewz-input label="Number" type="number" placeholder="0" size="md"></c-procrewz-input>
            <c-procrewz-input label="Phone" type="tel" placeholder="(555) 123-4567" size="md"></c-procrewz-input>
          </div>
        </div>
        
        <div>
          <h3>Input Masking</h3>
          <div class="section" id="masking-section"></div>
        </div>
      </div>
    `;

    // Add clearable inputs programmatically (needs value set via JS)
    const clearableSection = container.querySelector("#clearable-section");

    const clearable1 = document.createElement("c-procrewz-input");
    clearable1.label = "Search";
    clearable1.placeholder = "Type to search...";
    clearable1.value = "Hello World";
    clearable1.clearable = true;
    clearable1.size = "md";
    clearableSection.appendChild(clearable1);

    const clearable2 = document.createElement("c-procrewz-input");
    clearable2.label = "With Suffix";
    clearable2.placeholder = "username";
    clearable2.value = "john.doe";
    clearable2.suffix = "@example.com";
    clearable2.clearable = true;
    clearable2.size = "md";
    clearableSection.appendChild(clearable2);

    // Add masking inputs programmatically
    const maskingSection = container.querySelector("#masking-section");

    const phoneInput = document.createElement("c-procrewz-input");
    phoneInput.label = "Phone";
    phoneInput.placeholder = "(555) 123-4567";
    phoneInput.inputMask = "phone";
    phoneInput.size = "md";
    maskingSection.appendChild(phoneInput);

    const cardInput = document.createElement("c-procrewz-input");
    cardInput.label = "Credit Card";
    cardInput.placeholder = "0000 0000 0000 0000";
    cardInput.inputMask = "creditCard";
    cardInput.size = "md";
    maskingSection.appendChild(cardInput);

    const dateInput = document.createElement("c-procrewz-input");
    dateInput.label = "Date";
    dateInput.placeholder = "MM/DD/YYYY";
    dateInput.inputMask = "date";
    dateInput.size = "md";
    maskingSection.appendChild(dateInput);

    const numeralInput = document.createElement("c-procrewz-input");
    numeralInput.label = "Amount";
    numeralInput.placeholder = "0";
    numeralInput.prefix = "$";
    numeralInput.inputMask = "numeral";
    numeralInput.size = "md";
    maskingSection.appendChild(numeralInput);

    return container;
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      source: {
        code: `<!-- Sizes -->
<c-procrewz-input label="Small" size="sm"></c-procrewz-input>
<c-procrewz-input label="Medium" size="md"></c-procrewz-input>
<c-procrewz-input label="Large" size="lg"></c-procrewz-input>

<!-- Prefix & Suffix -->
<c-procrewz-input label="Website" prefix="https://"></c-procrewz-input>
<c-procrewz-input label="Email" suffix="@company.com"></c-procrewz-input>
<c-procrewz-input label="Price" prefix="$" suffix="USD"></c-procrewz-input>

<!-- Clearable -->
<c-procrewz-input label="Search" value="Hello" clearable></c-procrewz-input>

<!-- States -->
<c-procrewz-input label="Disabled" disabled></c-procrewz-input>
<c-procrewz-input label="Error" has-error error-message="Invalid"></c-procrewz-input>`
      }
    }
  }
};
