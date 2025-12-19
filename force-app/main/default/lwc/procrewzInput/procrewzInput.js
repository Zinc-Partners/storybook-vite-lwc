import { LightningElement, api, track } from "lwc";
import Cleave from "c/cleaveService";

export default class ProcrewzInput extends LightningElement {
  // Core Properties
  @api label = "";
  @api type = "text";
  @api placeholder = "";
  @api name = "";
  @api size = "md"; // sm, md, lg
  @api helpText = "";
  @api errorMessage = "";
  @api maxLength;
  @api minLength;
  @api min;
  @api max;
  @api step;
  @api pattern;
  @api autoComplete = "off";
  @api variant = "light"; // 'light' or 'dark'

  // Prefix/Suffix
  @api prefix = "";
  @api suffix = "";

  // Icon (calendar, search, email, creditCard, phone, or empty for auto-detect)
  @api icon = "";

  // Input Masking (phone, creditCard, date, time, or custom object)
  @api inputMask = "";

  // Visual Options
  @api hideLabel = false;
  @api requiredIndicator = "*";
  @api hideIcon = false; // Set to true to hide auto-detected icons

  // Time Picker Options
  @api timeFormat = "12"; // '12' or '24'
  @api showSeconds = false;
  @api minuteStep = 5; // 1, 5, 10, 15, 30
  @api dropdownPosition = "auto"; // 'auto', 'up', 'down'

  // Tracked state
  @track _value = "";
  @track _disabled = false;
  @track _required = false;
  @track _readonly = false;
  @track _hasError = false;
  @track _clearable = false;
  @track isFocused = false;
  @track passwordVisible = false;
  @track timePickerOpen = false;
  @track timePickerPosition = "down"; // computed position

  // Time picker state (temp values while picker is open)
  @track selectedHour = 12;
  @track selectedMinute = 0;
  @track selectedSecond = 0;
  @track selectedPeriod = "AM";

  // Stored values (committed on OK)
  _committedHour = 12;
  _committedMinute = 0;
  _committedSecond = 0;
  _committedPeriod = "AM";

  // Private
  cleaveInstance = null;
  _boundHandleClickOutside = null;

  // ============================================
  // API Getters/Setters
  // ============================================

  @api
  get value() {
    return this._value;
  }
  set value(val) {
    this._value = val || "";
    if (this.isTimeMask && val) {
      this.parseTimeValue(val);
    }
  }

  @api
  get disabled() {
    return this._disabled;
  }
  set disabled(val) {
    this._disabled = val === true || val === "true" || val === "";
  }

  @api
  get required() {
    return this._required;
  }
  set required(val) {
    this._required = val === true || val === "true" || val === "";
  }

  @api
  get readonly() {
    return this._readonly;
  }
  set readonly(val) {
    this._readonly = val === true || val === "true" || val === "";
  }

  @api
  get hasError() {
    return this._hasError;
  }
  set hasError(val) {
    this._hasError = val === true || val === "true" || val === "";
  }

  @api
  get clearable() {
    return this._clearable;
  }
  set clearable(val) {
    this._clearable = val === true || val === "true" || val === "";
  }

  // ============================================
  // Public Methods
  // ============================================

  @api
  focus() {
    const input = this.template.querySelector("input");
    if (input) input.focus();
  }

  @api
  blur() {
    const input = this.template.querySelector("input");
    if (input) input.blur();
  }

  @api
  checkValidity() {
    const input = this.template.querySelector("input");
    return input ? input.checkValidity() : true;
  }

  @api
  reportValidity() {
    const input = this.template.querySelector("input");
    return input ? input.reportValidity() : true;
  }

  @api
  getRawValue() {
    // Returns unmasked value if using Cleave
    if (this.cleaveInstance) {
      return this.cleaveInstance.getRawValue();
    }
    return this._value;
  }

  @api
  openTimePicker() {
    if (this.isTimeMask && !this.disabled) {
      // Store current values as committed
      this._committedHour = this.selectedHour;
      this._committedMinute = this.selectedMinute;
      this._committedSecond = this.selectedSecond;
      this._committedPeriod = this.selectedPeriod;

      // Calculate dropdown position
      this.calculateDropdownPosition();

      this.timePickerOpen = true;
      this.addClickOutsideListener();
    }
  }

  @api
  closeTimePicker() {
    this.timePickerOpen = false;
    this.removeClickOutsideListener();
  }

  // ============================================
  // Lifecycle
  // ============================================

  connectedCallback() {
    this._boundHandleClickOutside = this.handleClickOutside.bind(this);
  }

  renderedCallback() {
    // Initialize Cleave after render if needed
    if (this.inputMask && !this.cleaveInstance && !this.isTimeMask) {
      this.initializeCleave();
    }

    // Scroll to selected values when time picker opens
    if (this.timePickerOpen) {
      this.scrollToSelectedValues();
    }
  }

  disconnectedCallback() {
    // Cleanup Cleave instance
    if (this.cleaveInstance) {
      this.cleaveInstance.destroy();
      this.cleaveInstance = null;
    }
    this.removeClickOutsideListener();
  }

  // ============================================
  // Cleave.js Integration
  // ============================================

  initializeCleave() {
    const input = this.template.querySelector("input");
    if (!input || this.cleaveInstance) return;

    const options = this.getCleaveOptions();
    if (options) {
      try {
        this.cleaveInstance = new Cleave(input, {
          ...options,
          onValueChanged: (e) => {
            this._value = e.target.value;
            this.dispatchChangeEvent(e.target.rawValue);
          }
        });
      } catch (error) {
        console.warn("Cleave.js initialization failed:", error);
      }
    }
  }

  getCleaveOptions() {
    // Preset masks
    const presets = {
      phone: {
        phone: true,
        delimiter: " "
      },
      creditCard: {
        creditCard: true
      },
      date: {
        date: true,
        datePattern: ["m", "d", "Y"]
      },
      numeral: {
        numeral: true,
        numeralThousandsGroupStyle: "thousand"
      }
    };

    // Time mask is handled separately with our custom time picker
    if (this.inputMask === "time") {
      return null;
    }

    if (typeof this.inputMask === "string" && presets[this.inputMask]) {
      return presets[this.inputMask];
    }

    // Custom mask object passed as JSON string or object
    if (typeof this.inputMask === "object" && this.inputMask !== null) {
      return this.inputMask;
    }

    // Try parsing as JSON string
    if (typeof this.inputMask === "string" && this.inputMask.startsWith("{")) {
      try {
        return JSON.parse(this.inputMask);
      } catch (e) {
        console.warn("Invalid inputMask JSON:", e);
      }
    }

    return null;
  }

  // ============================================
  // Time Picker Logic
  // ============================================

  get isTimeMask() {
    return this.inputMask === "time";
  }

  get showTimePicker() {
    return this.isTimeMask && this.timePickerOpen;
  }

  get isClockIconClickable() {
    return this.isClockIcon && this.isTimeMask;
  }

  get isClockIconNonClickable() {
    return this.isClockIcon && !this.isTimeMask;
  }

  parseTimeValue(val) {
    // Parse time string like "12:30 PM" or "09:15 AM"
    const match = val.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
    if (match) {
      this.selectedHour = parseInt(match[1], 10) || 12;
      this.selectedMinute = parseInt(match[2], 10) || 0;
      this.selectedSecond = parseInt(match[3], 10) || 0;
      this.selectedPeriod = (match[4] || "AM").toUpperCase();

      // Also update committed values
      this._committedHour = this.selectedHour;
      this._committedMinute = this.selectedMinute;
      this._committedSecond = this.selectedSecond;
      this._committedPeriod = this.selectedPeriod;
    }
  }

  formatTimeValue() {
    const hour = String(this.selectedHour).padStart(2, "0");
    const minute = String(this.selectedMinute).padStart(2, "0");

    if (this.showSeconds) {
      const second = String(this.selectedSecond).padStart(2, "0");
      return `${hour}:${minute}:${second} ${this.selectedPeriod}`;
    }
    return `${hour}:${minute} ${this.selectedPeriod}`;
  }

  get hours() {
    const hoursList = [];

    // Start with 12, then 1-11
    hoursList.push({
      value: 12,
      label: "12",
      class:
        this.selectedHour === 12
          ? "procrewz-time-picker__item procrewz-time-picker__item--selected"
          : "procrewz-time-picker__item"
    });

    for (let i = 1; i <= 11; i++) {
      hoursList.push({
        value: i,
        label: String(i),
        class:
          this.selectedHour === i
            ? "procrewz-time-picker__item procrewz-time-picker__item--selected"
            : "procrewz-time-picker__item"
      });
    }
    return hoursList;
  }

  get minutes() {
    const minutesList = [];
    const step = parseInt(this.minuteStep, 10) || 1;

    for (let i = 0; i < 60; i += step) {
      minutesList.push({
        value: i,
        label: String(i).padStart(2, "0"),
        class:
          this.selectedMinute === i
            ? "procrewz-time-picker__item procrewz-time-picker__item--selected"
            : "procrewz-time-picker__item"
      });
    }
    return minutesList;
  }

  get seconds() {
    const secondsList = [];
    for (let i = 0; i < 60; i++) {
      secondsList.push({
        value: i,
        label: String(i).padStart(2, "0"),
        class:
          this.selectedSecond === i
            ? "procrewz-time-picker__item procrewz-time-picker__item--selected"
            : "procrewz-time-picker__item"
      });
    }
    return secondsList;
  }

  get amClass() {
    return this.selectedPeriod === "AM"
      ? "procrewz-time-picker__item procrewz-time-picker__item--selected"
      : "procrewz-time-picker__item";
  }

  get pmClass() {
    return this.selectedPeriod === "PM"
      ? "procrewz-time-picker__item procrewz-time-picker__item--selected"
      : "procrewz-time-picker__item";
  }

  get timePickerClass() {
    const classes = ["procrewz-time-picker"];
    classes.push(`procrewz-time-picker--${this.variant}`);
    if (this.timePickerPosition === "up") {
      classes.push("procrewz-time-picker--up");
    }
    return classes.join(" ");
  }

  calculateDropdownPosition() {
    // Explicit position overrides
    if (this.dropdownPosition === "up") {
      this.timePickerPosition = "up";
      return;
    }
    if (this.dropdownPosition === "down") {
      this.timePickerPosition = "down";
      return;
    }

    // Default to down
    this.timePickerPosition = "down";

    // Auto position - only switch to up if necessary
    const wrapper = this.template.querySelector(".procrewz-input-wrapper");
    if (wrapper) {
      const rect = wrapper.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 320; // Approximate height including footer

      // Only open upward if there's not enough space below
      if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
        this.timePickerPosition = "up";
      }
    }
  }

  scrollToSelectedValues() {
    // Use requestAnimationFrame to ensure DOM is updated
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    requestAnimationFrame(() => {
      const columns = this.template.querySelectorAll(
        ".procrewz-time-picker__column"
      );
      columns.forEach((column) => {
        const selected = column.querySelector(
          ".procrewz-time-picker__item--selected"
        );
        if (selected) {
          // Use scrollTop instead of scrollIntoView to prevent page scroll
          const scrollTop =
            selected.offsetTop -
            column.clientHeight / 2 +
            selected.clientHeight / 2;
          column.scrollTop = Math.max(0, scrollTop);
        }
      });
    });
  }

  handleTimeSelection(event) {
    const type = event.currentTarget.dataset.type;
    const value = event.currentTarget.dataset.value;

    // Update temp selection (not committed until OK is pressed)
    switch (type) {
      case "hour":
        this.selectedHour = parseInt(value, 10);
        break;
      case "minute":
        this.selectedMinute = parseInt(value, 10);
        break;
      case "second":
        this.selectedSecond = parseInt(value, 10);
        break;
      case "period":
        this.selectedPeriod = value;
        break;
      default:
        break;
    }
    // Don't close or commit - wait for OK button
  }

  handleTimePickerClick(event) {
    // Stop propagation to prevent click outside handler from firing
    event.stopPropagation();
  }

  handleTimePickerCancel(event) {
    event.preventDefault();
    event.stopPropagation();

    // Restore committed values
    this.selectedHour = this._committedHour;
    this.selectedMinute = this._committedMinute;
    this.selectedSecond = this._committedSecond;
    this.selectedPeriod = this._committedPeriod;

    this.closeTimePicker();
  }

  handleTimePickerOk(event) {
    event.preventDefault();
    event.stopPropagation();

    // Commit the selected values
    this._committedHour = this.selectedHour;
    this._committedMinute = this.selectedMinute;
    this._committedSecond = this.selectedSecond;
    this._committedPeriod = this.selectedPeriod;

    // Update the input value
    this._value = this.formatTimeValue();
    this.dispatchChangeEvent(this._value);

    this.closeTimePicker();
  }

  handleToggleTimePicker(event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.timePickerOpen) {
      this.closeTimePicker();
    } else {
      this.openTimePicker();
    }
  }

  addClickOutsideListener() {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      document.addEventListener("click", this._boundHandleClickOutside);
    }, 0);
  }

  removeClickOutsideListener() {
    document.removeEventListener("click", this._boundHandleClickOutside);
  }

  handleClickOutside(event) {
    const container = this.template.querySelector(".procrewz-input-wrapper");
    if (container && !container.contains(event.target)) {
      // Cancel on click outside (restore committed values)
      this.selectedHour = this._committedHour;
      this.selectedMinute = this._committedMinute;
      this.selectedSecond = this._committedSecond;
      this.selectedPeriod = this._committedPeriod;
      this.closeTimePicker();
    }
  }

  // ============================================
  // Computed Properties
  // ============================================

  get hasLabel() {
    return this.label && this.label.length > 0 && !this.hideLabel;
  }

  get hasPrefix() {
    return this.prefix && this.prefix.length > 0;
  }

  get hasSuffix() {
    return this.suffix && this.suffix.length > 0;
  }

  // Auto-detect icon based on type or inputMask, or use explicit icon prop
  get computedIcon() {
    if (this.hideIcon) return null;

    // If icon is explicitly set, use it
    if (this.icon) return this.icon;

    // Auto-detect based on inputMask
    if (this.inputMask === "creditCard") return "creditCard";
    if (this.inputMask === "date") return "calendar";
    if (this.inputMask === "time") return "clock";
    if (this.inputMask === "phone") return "phone";

    // Auto-detect based on type
    if (this.type === "email") return "email";
    if (this.type === "search") return "search";
    if (this.type === "tel") return "phone";
    if (this.type === "date") return "calendar";
    if (this.type === "time") return "clock";

    return null;
  }

  get hasIcon() {
    return this.computedIcon !== null;
  }

  get isCalendarIcon() {
    return this.computedIcon === "calendar";
  }

  get isSearchIcon() {
    return this.computedIcon === "search";
  }

  get isEmailIcon() {
    return this.computedIcon === "email";
  }

  get isCreditCardIcon() {
    return this.computedIcon === "creditCard";
  }

  get isPhoneIcon() {
    return this.computedIcon === "phone";
  }

  get isClockIcon() {
    return this.computedIcon === "clock";
  }

  get isPasswordType() {
    return this.type === "password";
  }

  get showPasswordToggle() {
    return this.isPasswordType && !this.hideIcon;
  }

  // Returns the actual input type (text when password is visible)
  get computedInputType() {
    if (this.isPasswordType && this.passwordVisible) {
      return "text";
    }
    return this.type;
  }

  get passwordToggleLabel() {
    return this.passwordVisible ? "Hide password" : "Show password";
  }

  get showClearButton() {
    return (
      this.clearable && this._value && this._value.length > 0 && !this.disabled
    );
  }

  get showHelperText() {
    return this.helpText && this.helpText.length > 0 && !this.hasError;
  }

  get showErrorMessage() {
    return this.hasError && this.errorMessage && this.errorMessage.length > 0;
  }

  get containerClass() {
    const classes = ["procrewz-input-container"];
    classes.push(`procrewz-input-container--${this.variant}`);
    if (this.disabled) classes.push("procrewz-input-container--disabled");
    return classes.join(" ");
  }

  get inputWrapperClass() {
    const classes = ["procrewz-input-wrapper"];

    // Add variant class
    classes.push(`procrewz-input-wrapper--${this.variant}`);

    classes.push(`procrewz-input-wrapper--${this.size}`);

    if (this.isFocused) classes.push("procrewz-input-wrapper--focused");
    if (this.hasError) classes.push("procrewz-input-wrapper--error");
    if (this.disabled) classes.push("procrewz-input-wrapper--disabled");
    if (this.hasPrefix) classes.push("procrewz-input-wrapper--has-prefix");
    if (
      this.hasSuffix ||
      this.showClearButton ||
      this.hasIcon ||
      this.showPasswordToggle
    )
      classes.push("procrewz-input-wrapper--has-suffix");
    if (this.clearable) classes.push("procrewz-input-wrapper--clearable");
    if (this.hasIcon) classes.push("procrewz-input-wrapper--has-icon");
    if (this.showPasswordToggle)
      classes.push("procrewz-input-wrapper--has-password-toggle");
    if (this.timePickerOpen)
      classes.push("procrewz-input-wrapper--time-picker-open");

    return classes.join(" ");
  }

  get inputClass() {
    const classes = ["procrewz-input"];
    classes.push(`procrewz-input--${this.size}`);
    if (this.hasPrefix) classes.push("procrewz-input--has-prefix");
    if (
      this.hasSuffix ||
      this.showClearButton ||
      this.hasIcon ||
      this.showPasswordToggle
    )
      classes.push("procrewz-input--has-suffix");
    return classes.join(" ");
  }

  get labelClass() {
    const classes = ["procrewz-input-label"];
    classes.push(`procrewz-input-label--${this.variant}`);
    if (this.required) classes.push("procrewz-input-label--required");
    return classes.join(" ");
  }

  get helperTextClass() {
    const classes = ["procrewz-input-helper"];
    classes.push(`procrewz-input-helper--${this.variant}`);
    if (this.hasError) classes.push("procrewz-input-helper--error");
    return classes.join(" ");
  }

  get ariaDescribedBy() {
    if (this.showErrorMessage) return "error-message";
    if (this.showHelperText) return "helper-text";
    return null;
  }

  get ariaLabel() {
    // Use label for aria-label when label is visually hidden
    return this.hideLabel && this.label ? this.label : null;
  }

  // ============================================
  // Event Handlers
  // ============================================

  handleInput(event) {
    if (this.cleaveInstance) return; // Cleave handles its own events

    let newValue = event.target.value;

    // For timeAmPm mask, handle custom input filtering
    if (this.isTimeMask) {
      newValue = this.filterTimeInput(newValue);
      event.target.value = newValue;
    }

    this._value = newValue;
    this.dispatchChangeEvent(this._value);
  }

  filterTimeInput(value) {
    // Allow only digits, colon, space, and A/M/P letters
    let filtered = "";
    let digitCount = 0;
    let hasColon = false;
    let hasSpace = false;
    let periodPart = "";

    for (let i = 0; i < value.length; i++) {
      const char = value[i];
      const upperChar = char.toUpperCase();

      // Allow digits for time
      if (/\d/.test(char)) {
        if (digitCount < 4) {
          // Max 4 digits (HH:MM)
          // Auto-insert colon after 2 digits
          if (digitCount === 2 && !hasColon) {
            filtered += ":";
            hasColon = true;
          }
          filtered += char;
          digitCount++;
        }
      }
      // Allow colon
      else if (char === ":" && !hasColon && digitCount >= 1) {
        filtered += char;
        hasColon = true;
      }
      // Allow space before AM/PM
      else if (char === " " && digitCount >= 3 && hasColon && !hasSpace) {
        filtered += char;
        hasSpace = true;
      }
      // Allow A, M, P for AM/PM
      else if (
        hasSpace &&
        (upperChar === "A" || upperChar === "M" || upperChar === "P")
      ) {
        if (periodPart.length < 2) {
          periodPart += upperChar;
          filtered += upperChar;
        }
      }
    }

    return filtered;
  }

  handleKeyDown(event) {
    // For timeAmPm, restrict keyboard input
    if (this.isTimeMask) {
      const key = event.key;
      const allowedKeys = [
        "Backspace",
        "Delete",
        "Tab",
        "Escape",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ];

      if (allowedKeys.includes(key)) {
        return; // Allow these keys
      }

      // Allow digits
      if (/^\d$/.test(key)) {
        return;
      }

      // Allow colon
      if (key === ":") {
        return;
      }

      // Allow space
      if (key === " ") {
        return;
      }

      // Allow A, M, P (case insensitive)
      if (/^[aAmMpP]$/.test(key)) {
        return;
      }

      // Block all other keys
      event.preventDefault();
    }
  }

  dispatchChangeEvent(rawValue) {
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          value: this._value,
          rawValue: rawValue || this._value,
          name: this.name
        },
        bubbles: true,
        composed: true
      })
    );
  }

  handleFocus() {
    this.isFocused = true;

    this.dispatchEvent(
      new CustomEvent("inputfocus", {
        detail: { value: this._value, name: this.name },
        bubbles: true,
        composed: true
      })
    );
  }

  handleBlur() {
    this.isFocused = false;

    // Validate and format the time on blur for timeAmPm
    if (this.isTimeMask && this._value) {
      this.parseTimeValue(this._value);
      this._value = this.formatTimeValue();
    }

    this.dispatchEvent(
      new CustomEvent("inputblur", {
        detail: { value: this._value, name: this.name },
        bubbles: true,
        composed: true
      })
    );
  }

  handleKeyUp(event) {
    if (event.key === "Enter") {
      this.dispatchEvent(
        new CustomEvent("enter", {
          detail: { value: this._value, name: this.name },
          bubbles: true,
          composed: true
        })
      );
    }
  }

  handleClear(event) {
    event.preventDefault();
    event.stopPropagation();

    this._value = "";

    if (this.cleaveInstance) {
      this.cleaveInstance.setRawValue("");
    }

    // Reset time picker values
    if (this.isTimeMask) {
      this.selectedHour = 12;
      this.selectedMinute = 0;
      this.selectedSecond = 0;
      this.selectedPeriod = "AM";
    }

    this.dispatchEvent(
      new CustomEvent("clear", {
        detail: { name: this.name },
        bubbles: true,
        composed: true
      })
    );

    this.dispatchChangeEvent("");

    // Refocus the input after clearing
    this.focus();
  }

  handleClearKeyUp(event) {
    if (event.key === "Enter" || event.key === " ") {
      this.handleClear(event);
    }
  }

  handleTogglePassword(event) {
    event.preventDefault();
    event.stopPropagation();
    this.passwordVisible = !this.passwordVisible;
  }

  handleTogglePasswordKeyUp(event) {
    if (event.key === "Enter" || event.key === " ") {
      this.handleTogglePassword(event);
    }
  }
}
