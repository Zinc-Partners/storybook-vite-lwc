# ProcrewzInput Component - Usage Guide

## Overview

The `c-procrewz-input` component is a versatile input field that supports various input types, masks, and validation. This guide covers all use cases and how to capture values.

---

## Capturing Values

All input types dispatch a `change` event when the value changes. Capture it using the `onchange` handler:

```html
<c-procrewz-input
  label="Your Field"
  onchange="{handleInputChange}"
></c-procrewz-input>
```

```javascript
handleInputChange(event) {
    const value = event.detail.value;
    console.log('Value:', value);
}
```

---

## Input Types & Examples

### 1. Text Input (Default)

```html
<c-procrewz-input
  label="Full Name"
  placeholder="Enter your name"
  value="{name}"
  onchange="{handleNameChange}"
></c-procrewz-input>
```

```javascript
@track name = '';

handleNameChange(event) {
    this.name = event.detail.value;
    // Output: "John Doe"
}
```

---

### 2. Email Input

```html
<c-procrewz-input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  value="{email}"
  onchange="{handleEmailChange}"
></c-procrewz-input>
```

```javascript
@track email = '';

handleEmailChange(event) {
    this.email = event.detail.value;
    // Output: "john@example.com"
}
```

---

### 3. Password Input

```html
<c-procrewz-input
  label="Password"
  type="password"
  placeholder="Enter password"
  value="{password}"
  onchange="{handlePasswordChange}"
></c-procrewz-input>
```

```javascript
@track password = '';

handlePasswordChange(event) {
    this.password = event.detail.value;
    // Output: "mySecretPass123"
}
```

---

### 4. Phone Number (Masked)

```html
<c-procrewz-input
  label="Phone Number"
  input-mask="phone"
  placeholder="(555) 555-5555"
  value="{phone}"
  onchange="{handlePhoneChange}"
></c-procrewz-input>
```

```javascript
@track phone = '';

handlePhoneChange(event) {
    this.phone = event.detail.value;
    // Output: "(555) 123-4567"

    // To get raw digits only, use a ref:
    // const rawPhone = this.template.querySelector('c-procrewz-input').getRawValue();
    // Output: "5551234567"
}
```

---

### 5. Date (Masked)

```html
<c-procrewz-input
  label="Date of Birth"
  input-mask="date"
  placeholder="MM/DD/YYYY"
  value="{dateOfBirth}"
  onchange="{handleDateChange}"
></c-procrewz-input>
```

```javascript
@track dateOfBirth = '';

handleDateChange(event) {
    this.dateOfBirth = event.detail.value;
    // Output: "12/25/2024"
}
```

---

### 6. Time (with Picker)

```html
<c-procrewz-input
  label="Appointment Time"
  input-mask="time"
  placeholder="12:00 AM"
  minute-step="5"
  value="{appointmentTime}"
  onchange="{handleTimeChange}"
></c-procrewz-input>
```

```javascript
@track appointmentTime = '';

handleTimeChange(event) {
    this.appointmentTime = event.detail.value;
    // Output: "09:30 AM"
}
```

**Time Picker Options:**

| Attribute           | Values           | Default | Description         |
| ------------------- | ---------------- | ------- | ------------------- |
| `minute-step`       | 1, 5, 10, 15, 30 | 5       | Minute increments   |
| `show-seconds`      | true/false       | false   | Show seconds column |
| `dropdown-position` | auto, up, down   | auto    | Dropdown direction  |
| `time-format`       | 12, 24           | 12      | Hour format         |

---

### 7. Credit Card Number (Masked)

```html
<c-procrewz-input
  label="Card Number"
  input-mask="creditCard"
  placeholder="0000 0000 0000 0000"
  value="{cardNumber}"
  onchange="{handleCardChange}"
></c-procrewz-input>
```

```javascript
@track cardNumber = '';

handleCardChange(event) {
    this.cardNumber = event.detail.value;
    // Output: "4111 1111 1111 1111"
}
```

---

### 8. Currency (Masked)

```html
<c-procrewz-input
  label="Amount"
  input-mask="currency"
  placeholder="$0.00"
  value="{amount}"
  onchange="{handleAmountChange}"
></c-procrewz-input>
```

```javascript
@track amount = '';

handleAmountChange(event) {
    this.amount = event.detail.value;
    // Output: "$1,234.56"
}
```

---

### 9. SSN (Masked)

```html
<c-procrewz-input
  label="Social Security Number"
  input-mask="ssn"
  placeholder="000-00-0000"
  value="{ssn}"
  onchange="{handleSSNChange}"
></c-procrewz-input>
```

```javascript
@track ssn = '';

handleSSNChange(event) {
    this.ssn = event.detail.value;
    // Output: "123-45-6789"
}
```

---

### 10. ZIP Code (Masked)

```html
<c-procrewz-input
  label="ZIP Code"
  input-mask="zipCode"
  placeholder="00000"
  value="{zipCode}"
  onchange="{handleZipChange}"
></c-procrewz-input>
```

```javascript
@track zipCode = '';

handleZipChange(event) {
    this.zipCode = event.detail.value;
    // Output: "90210" or "90210-1234"
}
```

---

### 11. Number Input

```html
<c-procrewz-input
  label="Quantity"
  type="number"
  min="1"
  max="100"
  value="{quantity}"
  onchange="{handleQuantityChange}"
></c-procrewz-input>
```

```javascript
@track quantity = 1;

handleQuantityChange(event) {
    this.quantity = parseInt(event.detail.value, 10);
    // Output: 25
}
```

---

### 12. Textarea

```html
<c-procrewz-input
  label="Comments"
  type="textarea"
  placeholder="Enter your comments..."
  rows="4"
  value="{comments}"
  onchange="{handleCommentsChange}"
></c-procrewz-input>
```

```javascript
@track comments = '';

handleCommentsChange(event) {
    this.comments = event.detail.value;
    // Output: "This is a multi-line comment..."
}
```

---

## Common Attributes

| Attribute       | Type    | Default   | Description                                                       |
| --------------- | ------- | --------- | ----------------------------------------------------------------- |
| `label`         | String  | ''        | Field label                                                       |
| `placeholder`   | String  | ''        | Placeholder text                                                  |
| `value`         | String  | ''        | Current value                                                     |
| `type`          | String  | 'text'    | Input type (text, email, password, number, textarea)              |
| `input-mask`    | String  | ''        | Mask type (phone, date, time, creditCard, currency, ssn, zipCode) |
| `disabled`      | Boolean | false     | Disable the input                                                 |
| `readonly`      | Boolean | false     | Make input read-only                                              |
| `required`      | Boolean | false     | Mark as required                                                  |
| `clearable`     | Boolean | false     | Show clear button                                                 |
| `variant`       | String  | 'default' | Visual variant (default, dark)                                    |
| `helper-text`   | String  | ''        | Helper text below input                                           |
| `error-message` | String  | ''        | Error message to display                                          |

---

## Complete Form Example

```html
<!-- employeeForm.html -->
<template>
  <div class="form-container">
    <c-procrewz-input
      label="Full Name"
      placeholder="Enter full name"
      value="{formData.name}"
      required
      data-field="name"
      onchange="{handleFieldChange}"
    ></c-procrewz-input>

    <c-procrewz-input
      label="Email"
      type="email"
      placeholder="employee@company.com"
      value="{formData.email}"
      required
      data-field="email"
      onchange="{handleFieldChange}"
    ></c-procrewz-input>

    <c-procrewz-input
      label="Phone"
      input-mask="phone"
      placeholder="(555) 555-5555"
      value="{formData.phone}"
      data-field="phone"
      onchange="{handleFieldChange}"
    ></c-procrewz-input>

    <c-procrewz-input
      label="Date of Birth"
      input-mask="date"
      placeholder="MM/DD/YYYY"
      value="{formData.dateOfBirth}"
      data-field="dateOfBirth"
      onchange="{handleFieldChange}"
    ></c-procrewz-input>

    <c-procrewz-input
      label="Start Time"
      input-mask="time"
      placeholder="09:00 AM"
      minute-step="15"
      value="{formData.startTime}"
      data-field="startTime"
      onchange="{handleFieldChange}"
    ></c-procrewz-input>

    <c-procrewz-input
      label="Hourly Rate"
      input-mask="currency"
      placeholder="$0.00"
      value="{formData.hourlyRate}"
      data-field="hourlyRate"
      onchange="{handleFieldChange}"
    ></c-procrewz-input>

    <button onclick="{handleSubmit}">Submit</button>
  </div>
</template>
```

```javascript
// employeeForm.js
import { LightningElement, track } from "lwc";

export default class EmployeeForm extends LightningElement {
  @track formData = {
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    startTime: "",
    hourlyRate: ""
  };

  handleFieldChange(event) {
    const field = event.target.dataset.field;
    this.formData = {
      ...this.formData,
      [field]: event.detail.value
    };
  }

  handleSubmit() {
    console.log("Form Data:", JSON.stringify(this.formData, null, 2));

    // Output:
    // {
    //     "name": "John Doe",
    //     "email": "john@company.com",
    //     "phone": "(555) 123-4567",
    //     "dateOfBirth": "06/15/1990",
    //     "startTime": "09:00 AM",
    //     "hourlyRate": "$45.00"
    // }

    // Send to server, Apex, etc.
    this.saveEmployee(this.formData);
  }

  async saveEmployee(data) {
    // Call Apex method
    // await saveEmployeeRecord({ employeeData: data });
  }
}
```

---

## Programmatic Access

### Get Raw Value (unmasked)

```javascript
// Get reference to input
const phoneInput = this.template.querySelector(
  'c-procrewz-input[data-field="phone"]'
);

// Get formatted value
const formatted = phoneInput.value; // "(555) 123-4567"

// Get raw value (digits only)
const raw = phoneInput.getRawValue(); // "5551234567"
```

### Focus/Blur

```javascript
const input = this.template.querySelector("c-procrewz-input");

// Focus the input
input.focus();

// Blur the input
input.blur();
```

### Open/Close Time Picker Programmatically

```javascript
const timeInput = this.template.querySelector(
  'c-procrewz-input[input-mask="time"]'
);

// Open the time picker
timeInput.openTimePicker();

// Close the time picker
timeInput.closeTimePicker();
```

---

## Validation

```javascript
handleSubmit() {
    const inputs = this.template.querySelectorAll('c-procrewz-input');
    let isValid = true;

    inputs.forEach(input => {
        if (input.required && !input.value) {
            input.setCustomValidity('This field is required');
            isValid = false;
        } else {
            input.setCustomValidity('');
        }
    });

    if (isValid) {
        // Submit form
    }
}
```

---

## Dark Mode

```html
<c-procrewz-input
  label="Dark Mode Input"
  variant="dark"
  placeholder="Enter text..."
></c-procrewz-input>
```

---

## Events

| Event    | Detail              | Description                  |
| -------- | ------------------- | ---------------------------- |
| `change` | `{ value: string }` | Fired when value changes     |
| `focus`  | `{ value: string }` | Fired when input gains focus |
| `blur`   | `{ value: string }` | Fired when input loses focus |

```javascript
handleFocus(event) {
    console.log('Input focused with value:', event.detail.value);
}

handleBlur(event) {
    console.log('Input blurred with value:', event.detail.value);
}
```
