/* eslint-disable no-unused-vars, no-useless-escape, @lwc/lwc/no-document-query, @lwc/lwc/no-async-operation */
/**
 * Cleave.js - Input formatting library
 * Bundled for LWC ES Module usage
 * Original: https://github.com/nosir/cleave.js
 * License: Apache-2.0
 */

// ============================================
// UTIL
// ============================================
const Util = {
  noop: function () {},

  strip: function (value, re) {
    return value.replace(re, "");
  },

  getPostDelimiter: function (value, delimiter, delimiters) {
    if (delimiters.length === 0) {
      return value.slice(-delimiter.length) === delimiter ? delimiter : "";
    }

    let matchedDelimiter = "";
    delimiters.forEach(function (current) {
      if (value.slice(-current.length) === current) {
        matchedDelimiter = current;
      }
    });

    return matchedDelimiter;
  },

  getDelimiterREByDelimiter: function (delimiter) {
    return new RegExp(delimiter.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), "g");
  },

  getNextCursorPosition: function (
    prevPos,
    oldValue,
    newValue,
    delimiter,
    delimiters
  ) {
    if (oldValue.length === prevPos) {
      return newValue.length;
    }

    return (
      prevPos +
      this.getPositionOffset(prevPos, oldValue, newValue, delimiter, delimiters)
    );
  },

  getPositionOffset: function (
    prevPos,
    oldValue,
    newValue,
    delimiter,
    delimiters
  ) {
    let oldRawValue, newRawValue, lengthOffset;

    oldRawValue = this.stripDelimiters(
      oldValue.slice(0, prevPos),
      delimiter,
      delimiters
    );
    newRawValue = this.stripDelimiters(
      newValue.slice(0, prevPos),
      delimiter,
      delimiters
    );
    lengthOffset = oldRawValue.length - newRawValue.length;

    return lengthOffset !== 0 ? lengthOffset / Math.abs(lengthOffset) : 0;
  },

  stripDelimiters: function (value, delimiter, delimiters) {
    let owner = this;

    if (delimiters.length === 0) {
      let delimiterRE = delimiter
        ? owner.getDelimiterREByDelimiter(delimiter)
        : "";
      return value.replace(delimiterRE, "");
    }

    delimiters.forEach(function (current) {
      current.split("").forEach(function (letter) {
        value = value.replace(owner.getDelimiterREByDelimiter(letter), "");
      });
    });

    return value;
  },

  headStr: function (str, length) {
    return str.slice(0, length);
  },

  getMaxLength: function (blocks) {
    return blocks.reduce(function (previous, current) {
      return previous + current;
    }, 0);
  },

  getPrefixStrippedValue: function (
    value,
    prefix,
    prefixLength,
    prevResult,
    delimiter,
    delimiters,
    noImmediatePrefix,
    tailPrefix,
    signBeforePrefix
  ) {
    if (prefixLength === 0) {
      return value;
    }

    if (signBeforePrefix && value.slice(0, 1) === "-") {
      let prev =
        prevResult.slice(0, 1) === "-" ? prevResult.slice(1) : prevResult;
      return (
        "-" +
        this.getPrefixStrippedValue(
          value.slice(1),
          prefix,
          prefixLength,
          prev,
          delimiter,
          delimiters,
          noImmediatePrefix,
          tailPrefix,
          signBeforePrefix
        )
      );
    }

    if (prevResult.slice(0, prefixLength) !== prefix && !tailPrefix) {
      if (noImmediatePrefix && !prevResult && value) return value;
      return "";
    } else if (prevResult.slice(-prefixLength) !== prefix && tailPrefix) {
      if (noImmediatePrefix && !prevResult && value) return value;
      return "";
    }

    if (tailPrefix) {
      return value.slice(0, -prefixLength);
    }

    return value.slice(prefixLength);
  },

  getFormattedValue: function (
    value,
    blocks,
    blocksLength,
    delimiter,
    delimiters,
    delimiterLazyShow
  ) {
    let result = "",
      multipleDelimiters = delimiters.length > 0,
      currentDelimiter = "";

    if (blocksLength === 0) {
      return value;
    }

    blocks.forEach(function (length, index) {
      if (value.length > 0) {
        let sub = value.slice(0, length),
          rest = value.slice(length);

        if (multipleDelimiters) {
          currentDelimiter =
            delimiters[delimiterLazyShow ? index - 1 : index] ||
            currentDelimiter;
        } else {
          currentDelimiter = delimiter;
        }

        if (delimiterLazyShow) {
          if (index > 0) {
            result += currentDelimiter;
          }

          result += sub;
        } else {
          result += sub;

          if (sub.length === length && index < blocksLength - 1) {
            result += currentDelimiter;
          }
        }

        value = rest;
      }
    });

    return result;
  },

  fixPrefixCursor: function (el, prefix, delimiter, delimiters) {
    if (!el) {
      return;
    }

    let appendix = delimiter || delimiters[0] || " ";

    if (!el.setSelectionRange) {
      return;
    }

    if (
      el.selectionStart === el.selectionEnd &&
      el.selectionStart < prefix.length + appendix.length
    ) {
      el.setSelectionRange(
        prefix.length + appendix.length,
        prefix.length + appendix.length
      );
    }
  },

  checkFullSelection: function (value) {
    try {
      let sel = window.getSelection() || document.getSelection() || {};
      return sel.toString().length === value.length;
    } catch (ex) {
      return false;
    }
  },

  setSelection: function (element, position, doc) {
    if (element !== this.getActiveElement(doc)) {
      return;
    }

    if (element && element.value.length <= position) {
      return;
    }

    if (element.createTextRange) {
      let range = element.createTextRange();
      range.move("character", position);
      range.select();
    } else {
      try {
        element.setSelectionRange(position, position);
      } catch (e) {
        // The input element type does not support selection
      }
    }
  },

  getActiveElement: function (parent) {
    let activeElement = parent.activeElement;
    if (activeElement && activeElement.shadowRoot) {
      return this.getActiveElement(activeElement.shadowRoot);
    }
    return activeElement;
  },

  isAndroid: function () {
    return navigator && /android/i.test(navigator.userAgent);
  }
};

// ============================================
// DEFAULT PROPERTIES
// ============================================
const DefaultProperties = {
  assign: function (target, opts) {
    target = target || {};
    opts = opts || {};

    target.creditCard = !!opts.creditCard;
    target.creditCardStrictMode = !!opts.creditCardStrictMode;
    target.creditCardType = "";
    target.onCreditCardTypeChanged =
      opts.onCreditCardTypeChanged || function () {};

    target.phone = !!opts.phone;
    target.phoneRegionCode = opts.phoneRegionCode || "US";
    target.phoneFormatter = {};

    target.time = !!opts.time;
    target.timePattern = opts.timePattern || ["h", "m", "s"];
    target.timeFormat = opts.timeFormat || "24";
    target.timeFormatter = {};

    target.date = !!opts.date;
    target.datePattern = opts.datePattern || ["m", "d", "Y"];
    target.dateMin = opts.dateMin || "";
    target.dateMax = opts.dateMax || "";
    target.dateFormatter = {};

    target.numeral = !!opts.numeral;
    target.numeralIntegerScale =
      opts.numeralIntegerScale > 0 ? opts.numeralIntegerScale : 0;
    target.numeralDecimalScale =
      opts.numeralDecimalScale >= 0 ? opts.numeralDecimalScale : 2;
    target.numeralDecimalMark = opts.numeralDecimalMark || ".";
    target.numeralThousandsGroupStyle =
      opts.numeralThousandsGroupStyle || "thousand";
    target.numeralPositiveOnly = !!opts.numeralPositiveOnly;
    target.stripLeadingZeroes = opts.stripLeadingZeroes !== false;
    target.signBeforePrefix = !!opts.signBeforePrefix;
    target.tailPrefix = !!opts.tailPrefix;

    target.swapHiddenInput = !!opts.swapHiddenInput;

    target.numericOnly = target.creditCard || target.date || !!opts.numericOnly;

    target.uppercase = !!opts.uppercase;
    target.lowercase = !!opts.lowercase;

    target.prefix = target.creditCard || target.date ? "" : opts.prefix || "";
    target.noImmediatePrefix = !!opts.noImmediatePrefix;
    target.prefixLength = target.prefix.length;
    target.rawValueTrimPrefix = !!opts.rawValueTrimPrefix;
    target.copyDelimiter = !!opts.copyDelimiter;

    target.initValue =
      opts.initValue !== undefined && opts.initValue !== null
        ? opts.initValue.toString()
        : "";

    target.delimiter =
      opts.delimiter || opts.delimiter === ""
        ? opts.delimiter
        : opts.date
          ? "/"
          : opts.time
            ? ":"
            : opts.numeral
              ? ","
              : opts.phone
                ? " "
                : " ";
    target.delimiterLength = target.delimiter.length;
    target.delimiterLazyShow = !!opts.delimiterLazyShow;
    target.delimiters = opts.delimiters || [];

    target.blocks = opts.blocks || [];
    target.blocksLength = target.blocks.length;

    target.root = typeof global === "object" && global ? global : window;
    target.document = opts.document || target.root.document;

    target.maxLength = 0;

    target.backspace = false;
    target.result = "";

    target.onValueChanged = opts.onValueChanged || function () {};

    return target;
  }
};

// ============================================
// CREDIT CARD DETECTOR
// ============================================
const CreditCardDetector = {
  blocks: {
    uatp: [4, 5, 6],
    amex: [4, 6, 5],
    diners: [4, 6, 4],
    discover: [4, 4, 4, 4],
    mastercard: [4, 4, 4, 4],
    dankort: [4, 4, 4, 4],
    instapayment: [4, 4, 4, 4],
    jcb15: [4, 6, 5],
    jcb: [4, 4, 4, 4],
    maestro: [4, 4, 4, 4],
    visa: [4, 4, 4, 4],
    mir: [4, 4, 4, 4],
    unionPay: [4, 4, 4, 4],
    general: [4, 4, 4, 4]
  },

  re: {
    uatp: /^(?!1800)1\d{0,14}/,
    amex: /^3[47]\d{0,13}/,
    discover: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
    diners: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,
    mastercard: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
    dankort: /^(5019|4175|4571)\d{0,12}/,
    instapayment: /^63[7-9]\d{0,13}/,
    jcb15: /^(?:2131|1800)\d{0,11}/,
    jcb: /^(?:35\d{0,2})\d{0,12}/,
    maestro: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,
    mir: /^220[0-4]\d{0,12}/,
    visa: /^4\d{0,15}/,
    unionPay: /^(62|81)\d{0,14}/
  },

  getStrictBlocks: function (block) {
    let total = block.reduce(function (prev, current) {
      return prev + current;
    }, 0);

    return block.concat(19 - total);
  },

  getInfo: function (value, strictMode) {
    let blocks = CreditCardDetector.blocks,
      re = CreditCardDetector.re;

    strictMode = !!strictMode;

    for (let key in re) {
      if (re[key].test(value)) {
        let matchedBlocks = blocks[key];
        return {
          type: key,
          blocks: strictMode
            ? this.getStrictBlocks(matchedBlocks)
            : matchedBlocks
        };
      }
    }

    return {
      type: "unknown",
      blocks: strictMode ? this.getStrictBlocks(blocks.general) : blocks.general
    };
  }
};

// ============================================
// DATE FORMATTER
// ============================================
class DateFormatter {
  constructor(datePattern, dateMin, dateMax) {
    this.date = [];
    this.blocks = [];
    this.datePattern = datePattern;
    this.dateMin = dateMin
      .split("-")
      .reverse()
      .map(function (x) {
        return parseInt(x, 10);
      });
    if (this.dateMin.length === 2) this.dateMin.unshift(0);
    this.dateMax = dateMax
      .split("-")
      .reverse()
      .map(function (x) {
        return parseInt(x, 10);
      });
    if (this.dateMax.length === 2) this.dateMax.unshift(0);
    this.initBlocks();
  }

  initBlocks() {
    this.datePattern.forEach((value) => {
      if (value === "Y") {
        this.blocks.push(4);
      } else {
        this.blocks.push(2);
      }
    });
  }

  getISOFormatDate() {
    let date = this.date;
    return date[2]
      ? date[2] +
          "-" +
          this.addLeadingZero(date[1]) +
          "-" +
          this.addLeadingZero(date[0])
      : "";
  }

  getBlocks() {
    return this.blocks;
  }

  getValidatedDate(value) {
    let result = "";
    value = value.replace(/[^\d]/g, "");
    this.blocks.forEach((length, index) => {
      if (value.length > 0) {
        let sub = value.slice(0, length),
          sub0 = sub.slice(0, 1),
          rest = value.slice(length);

        switch (this.datePattern[index]) {
          case "d":
            if (sub === "00") {
              sub = "01";
            } else if (parseInt(sub0, 10) > 3) {
              sub = "0" + sub0;
            } else if (parseInt(sub, 10) > 31) {
              sub = "31";
            }
            break;
          case "m":
            if (sub === "00") {
              sub = "01";
            } else if (parseInt(sub0, 10) > 1) {
              sub = "0" + sub0;
            } else if (parseInt(sub, 10) > 12) {
              sub = "12";
            }
            break;
          default:
            break;
        }

        result += sub;
        value = rest;
      }
    });

    return this.getFixedDateString(result);
  }

  getFixedDateString(value) {
    let datePattern = this.datePattern,
      date = [],
      dayStartIndex = 0,
      monthStartIndex = 0,
      yearStartIndex = 0,
      day,
      month,
      year,
      fullYearDone = false;

    if (
      value.length === 4 &&
      datePattern[0].toLowerCase() !== "y" &&
      datePattern[1].toLowerCase() !== "y"
    ) {
      dayStartIndex = datePattern[0] === "d" ? 0 : 2;
      monthStartIndex = 2 - dayStartIndex;
      day = parseInt(value.slice(dayStartIndex, dayStartIndex + 2), 10);
      month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);
      date = this.getFixedDate(day, month, 0);
    }

    if (value.length === 8) {
      let dayIndex = 0,
        monthIndex = 0,
        yearIndex = 0;
      datePattern.forEach((type, index) => {
        switch (type) {
          case "d":
            dayIndex = index;
            break;
          case "m":
            monthIndex = index;
            break;
          default:
            yearIndex = index;
            break;
        }
      });

      yearStartIndex = yearIndex * 2;
      dayStartIndex = dayIndex <= yearIndex ? dayIndex * 2 : dayIndex * 2 + 2;
      monthStartIndex =
        monthIndex <= yearIndex ? monthIndex * 2 : monthIndex * 2 + 2;

      day = parseInt(value.slice(dayStartIndex, dayStartIndex + 2), 10);
      month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);
      year = parseInt(value.slice(yearStartIndex, yearStartIndex + 4), 10);

      fullYearDone =
        value.slice(yearStartIndex, yearStartIndex + 4).length === 4;

      date = this.getFixedDate(day, month, year);
    }

    this.date = date;

    return date.length === 0
      ? value
      : datePattern.reduce((previous, current) => {
          switch (current) {
            case "d":
              return (
                previous + (date[0] === 0 ? "" : this.addLeadingZero(date[0]))
              );
            case "m":
              return (
                previous + (date[1] === 0 ? "" : this.addLeadingZero(date[1]))
              );
            default:
              return (
                previous +
                (fullYearDone ? this.addLeadingZeroForYear(date[2], false) : "")
              );
          }
        }, "");
  }

  getFixedDate(day, month, year) {
    day = Math.min(day, 31);
    month = Math.min(month, 12);
    year = parseInt(year || 0, 10);

    if (
      (this.dateMin.length &&
        (year < this.dateMin[2] ||
          (year === this.dateMin[2] &&
            (month < this.dateMin[1] ||
              (month === this.dateMin[1] && day < this.dateMin[0]))))) ||
      (this.dateMax.length &&
        (year > this.dateMax[2] ||
          (year === this.dateMax[2] &&
            (month > this.dateMax[1] ||
              (month === this.dateMax[1] && day > this.dateMax[0])))))
    ) {
      return [];
    }

    return [day, month, year];
  }

  addLeadingZero(number) {
    return (number < 10 ? "0" : "") + number;
  }

  addLeadingZeroForYear(number) {
    return (number < 10 ? "0" : "") + number;
  }
}

// ============================================
// TIME FORMATTER
// ============================================
class TimeFormatter {
  constructor(timePattern, timeFormat) {
    this.time = [];
    this.blocks = [];
    this.timePattern = timePattern;
    this.timeFormat = timeFormat;
    this.initBlocks();
  }

  initBlocks() {
    this.timePattern.forEach(() => {
      this.blocks.push(2);
    });
  }

  getISOFormatTime() {
    let time = this.time;
    return time[2]
      ? this.addLeadingZero(time[0]) +
          ":" +
          this.addLeadingZero(time[1]) +
          ":" +
          this.addLeadingZero(time[2])
      : "";
  }

  getBlocks() {
    return this.blocks;
  }

  getTimeFormatOptions() {
    if (String(this.timeFormat) === "12") {
      return {
        maxHourFirstDigit: 1,
        maxHours: 12,
        maxMinutesFirstDigit: 5,
        maxMinutes: 60
      };
    }
    return {
      maxHourFirstDigit: 2,
      maxHours: 23,
      maxMinutesFirstDigit: 5,
      maxMinutes: 60
    };
  }

  getValidatedTime(value) {
    let result = "";
    value = value.replace(/[^\d]/g, "");

    let timeFormatOptions = this.getTimeFormatOptions();

    this.blocks.forEach((length, index) => {
      if (value.length > 0) {
        let sub = value.slice(0, length),
          sub0 = sub.slice(0, 1),
          rest = value.slice(length);

        switch (this.timePattern[index]) {
          case "h":
            if (parseInt(sub0, 10) > timeFormatOptions.maxHourFirstDigit) {
              sub = "0" + sub0;
            } else if (parseInt(sub, 10) > timeFormatOptions.maxHours) {
              sub = timeFormatOptions.maxHours + "";
            }
            break;
          case "m":
          case "s":
            if (parseInt(sub0, 10) > timeFormatOptions.maxMinutesFirstDigit) {
              sub = "0" + sub0;
            } else if (parseInt(sub, 10) > timeFormatOptions.maxMinutes) {
              sub = timeFormatOptions.maxMinutes + "";
            }
            break;
          default:
            break;
        }

        result += sub;
        value = rest;
      }
    });

    return this.getFixedTimeString(result);
  }

  getFixedTimeString(value) {
    let timePattern = this.timePattern,
      time = [];

    if (value.length === 6) {
      let secondIndex = 0,
        minuteIndex = 0,
        hourIndex = 0;
      timePattern.forEach((type, index) => {
        switch (type) {
          case "s":
            secondIndex = index * 2;
            break;
          case "m":
            minuteIndex = index * 2;
            break;
          case "h":
            hourIndex = index * 2;
            break;
          default:
            break;
        }
      });

      let second = parseInt(value.slice(secondIndex, secondIndex + 2), 10);
      let minute = parseInt(value.slice(minuteIndex, minuteIndex + 2), 10);
      let hour = parseInt(value.slice(hourIndex, hourIndex + 2), 10);

      time = this.getFixedTime(hour, minute, second);
    }

    if (value.length === 4 && this.timePattern.indexOf("s") < 0) {
      let minuteIndex = 0,
        hourIndex = 0;
      timePattern.forEach((type, index) => {
        switch (type) {
          case "m":
            minuteIndex = index * 2;
            break;
          case "h":
            hourIndex = index * 2;
            break;
          default:
            break;
        }
      });

      let minute = parseInt(value.slice(minuteIndex, minuteIndex + 2), 10);
      let hour = parseInt(value.slice(hourIndex, hourIndex + 2), 10);

      time = this.getFixedTime(hour, minute, 0);
    }

    this.time = time;

    return time.length === 0
      ? value
      : timePattern.reduce((previous, current) => {
          switch (current) {
            case "s":
              return previous + this.addLeadingZero(time[2]);
            case "m":
              return previous + this.addLeadingZero(time[1]);
            case "h":
              return previous + this.addLeadingZero(time[0]);
            default:
              return previous;
          }
        }, "");
  }

  getFixedTime(hour, minute, second) {
    second = Math.min(parseInt(second || 0, 10), 60);
    minute = Math.min(minute, 60);
    hour = Math.min(hour, 60);

    return [hour, minute, second];
  }

  addLeadingZero(number) {
    return (number < 10 ? "0" : "") + number;
  }
}

// ============================================
// NUMERAL FORMATTER
// ============================================
class NumeralFormatter {
  constructor(
    numeralDecimalMark,
    numeralIntegerScale,
    numeralDecimalScale,
    numeralThousandsGroupStyle,
    numeralPositiveOnly,
    stripLeadingZeroes,
    prefix,
    signBeforePrefix,
    tailPrefix,
    delimiter
  ) {
    this.numeralDecimalMark = numeralDecimalMark;
    this.numeralIntegerScale = numeralIntegerScale;
    this.numeralDecimalScale = numeralDecimalScale;
    this.numeralThousandsGroupStyle = numeralThousandsGroupStyle;
    this.numeralPositiveOnly = numeralPositiveOnly;
    this.stripLeadingZeroes = stripLeadingZeroes;
    this.prefix = prefix;
    this.signBeforePrefix = signBeforePrefix;
    this.tailPrefix = tailPrefix;
    this.delimiter = delimiter;
  }

  getRawValue(value) {
    return value
      .replace(this.delimiter ? new RegExp("\\" + this.delimiter, "g") : "", "")
      .replace(this.numeralDecimalMark, ".");
  }

  format(value) {
    let partSign,
      partSignAndPrefix,
      partInteger,
      partDecimal = "";

    value = value
      .replace(/[A-Za-z]/g, "")
      .replace(this.numeralDecimalMark, "M")
      .replace(/[^\dM-]/g, "")
      .replace(/^\-/, "N")
      .replace(/\-/g, "")
      .replace("N", this.numeralPositiveOnly ? "" : "-")
      .replace("M", this.numeralDecimalMark);

    if (this.stripLeadingZeroes) {
      value = value.replace(/^(-)?0+(?=\d)/, "$1");
    }

    partSign = value.slice(0, 1) === "-" ? "-" : "";
    if (typeof this.prefix !== "undefined") {
      if (this.signBeforePrefix) {
        partSignAndPrefix = partSign + this.prefix;
      } else {
        partSignAndPrefix = this.prefix + partSign;
      }
    } else {
      partSignAndPrefix = partSign;
    }

    partInteger = value;

    if (value.indexOf(this.numeralDecimalMark) >= 0) {
      let parts = value.split(this.numeralDecimalMark);
      partInteger = parts[0];
      partDecimal =
        this.numeralDecimalMark + parts[1].slice(0, this.numeralDecimalScale);
    }

    if (partSign === "-") {
      partInteger = partInteger.slice(1);
    }

    if (this.numeralIntegerScale > 0) {
      partInteger = partInteger.slice(0, this.numeralIntegerScale);
    }

    switch (this.numeralThousandsGroupStyle) {
      case "lakh":
        partInteger = partInteger.replace(
          /(\d)(?=(\d\d)+\d$)/g,
          "$1" + this.delimiter
        );
        break;
      case "wan":
        partInteger = partInteger.replace(
          /(\d)(?=(\d{4})+$)/g,
          "$1" + this.delimiter
        );
        break;
      case "thousand":
        partInteger = partInteger.replace(
          /(\d)(?=(\d{3})+$)/g,
          "$1" + this.delimiter
        );
        break;
      default:
        break;
    }

    if (this.tailPrefix) {
      return (
        partSign +
        partInteger +
        (this.numeralDecimalScale > 0 ? partDecimal : "") +
        this.prefix
      );
    }

    return (
      partSignAndPrefix +
      partInteger +
      (this.numeralDecimalScale > 0 ? partDecimal : "")
    );
  }
}

// ============================================
// PHONE FORMATTER (Simple US format)
// ============================================
class PhoneFormatter {
  constructor(delimiter = " ") {
    this.delimiter = delimiter;
    this.maxLength = 10; // US phone: 3 + 3 + 4
  }

  format(value) {
    // Remove all non-digits and limit to max length
    let cleaned = value.replace(/\D/g, "").slice(0, this.maxLength);

    // Format as (XXX) XXX-XXXX
    let formatted = "";

    if (cleaned.length > 0) {
      formatted = "(" + cleaned.slice(0, 3);
    }
    if (cleaned.length >= 3) {
      formatted += ") ";
    }
    if (cleaned.length > 3) {
      formatted += cleaned.slice(3, 6);
    }
    if (cleaned.length >= 6) {
      formatted += "-";
    }
    if (cleaned.length > 6) {
      formatted += cleaned.slice(6, 10);
    }

    return formatted;
  }
}

// ============================================
// MAIN CLEAVE CLASS
// ============================================
class Cleave {
  constructor(element, opts) {
    this.element =
      typeof element === "string" ? document.querySelector(element) : element;

    if (!this.element) {
      throw new Error("[cleave.js] Please check the element");
    }

    opts.initValue = this.element.value;
    this.properties = DefaultProperties.assign({}, opts);
    this.init();
  }

  init() {
    const pps = this.properties;

    if (
      !pps.numeral &&
      !pps.phone &&
      !pps.creditCard &&
      !pps.time &&
      !pps.date &&
      pps.blocksLength === 0 &&
      !pps.prefix
    ) {
      this.onInput(pps.initValue);
      return;
    }

    pps.maxLength = Util.getMaxLength(pps.blocks);

    this.isAndroid = Util.isAndroid();
    this.lastInputValue = "";
    this.isBackward = "";

    this.onChangeListener = this.onChange.bind(this);
    this.onKeyDownListener = this.onKeyDown.bind(this);
    this.onFocusListener = this.onFocus.bind(this);
    this.onCutListener = this.onCut.bind(this);
    this.onCopyListener = this.onCopy.bind(this);

    this.element.addEventListener("input", this.onChangeListener);
    this.element.addEventListener("keydown", this.onKeyDownListener);
    this.element.addEventListener("focus", this.onFocusListener);
    this.element.addEventListener("cut", this.onCutListener);
    this.element.addEventListener("copy", this.onCopyListener);

    this.initPhoneFormatter();
    this.initDateFormatter();
    this.initTimeFormatter();
    this.initNumeralFormatter();

    if (pps.initValue || (pps.prefix && !pps.noImmediatePrefix)) {
      this.onInput(pps.initValue);
    }
  }

  initNumeralFormatter() {
    const pps = this.properties;
    if (!pps.numeral) return;

    pps.numeralFormatter = new NumeralFormatter(
      pps.numeralDecimalMark,
      pps.numeralIntegerScale,
      pps.numeralDecimalScale,
      pps.numeralThousandsGroupStyle,
      pps.numeralPositiveOnly,
      pps.stripLeadingZeroes,
      pps.prefix,
      pps.signBeforePrefix,
      pps.tailPrefix,
      pps.delimiter
    );
  }

  initTimeFormatter() {
    const pps = this.properties;
    if (!pps.time) return;

    pps.timeFormatter = new TimeFormatter(pps.timePattern, pps.timeFormat);
    pps.blocks = pps.timeFormatter.getBlocks();
    pps.blocksLength = pps.blocks.length;
    pps.maxLength = Util.getMaxLength(pps.blocks);
  }

  initDateFormatter() {
    const pps = this.properties;
    if (!pps.date) return;

    pps.dateFormatter = new DateFormatter(
      pps.datePattern,
      pps.dateMin,
      pps.dateMax
    );
    pps.blocks = pps.dateFormatter.getBlocks();
    pps.blocksLength = pps.blocks.length;
    pps.maxLength = Util.getMaxLength(pps.blocks);
  }

  initPhoneFormatter() {
    const pps = this.properties;
    if (!pps.phone) return;

    pps.phoneFormatter = new PhoneFormatter(pps.delimiter);
  }

  onKeyDown(event) {
    const charCode = event.which || event.keyCode;
    this.lastInputValue = this.element.value;
    this.isBackward = charCode === 8;
  }

  onChange(event) {
    const pps = this.properties;
    this.isBackward =
      this.isBackward || event.inputType === "deleteContentBackward";

    const postDelimiter = Util.getPostDelimiter(
      this.lastInputValue,
      pps.delimiter,
      pps.delimiters
    );

    if (this.isBackward && postDelimiter) {
      pps.postDelimiterBackspace = postDelimiter;
    } else {
      pps.postDelimiterBackspace = false;
    }

    this.onInput(this.element.value);
  }

  onFocus() {
    const pps = this.properties;
    this.lastInputValue = this.element.value;

    if (pps.prefix && pps.noImmediatePrefix && !this.element.value) {
      this.onInput(pps.prefix);
    }

    Util.fixPrefixCursor(
      this.element,
      pps.prefix,
      pps.delimiter,
      pps.delimiters
    );
  }

  onCut(e) {
    if (!Util.checkFullSelection(this.element.value)) return;
    this.copyClipboardData(e);
    this.onInput("");
  }

  onCopy(e) {
    if (!Util.checkFullSelection(this.element.value)) return;
    this.copyClipboardData(e);
  }

  copyClipboardData(e) {
    const pps = this.properties;
    let textToCopy = "";

    if (!pps.copyDelimiter) {
      textToCopy = Util.stripDelimiters(
        this.element.value,
        pps.delimiter,
        pps.delimiters
      );
    } else {
      textToCopy = this.element.value;
    }

    try {
      if (e.clipboardData) {
        e.clipboardData.setData("Text", textToCopy);
      } else {
        window.clipboardData.setData("Text", textToCopy);
      }
      e.preventDefault();
    } catch (ex) {
      // empty
    }
  }

  onInput(value) {
    const pps = this.properties;

    const postDelimiterAfter = Util.getPostDelimiter(
      value,
      pps.delimiter,
      pps.delimiters
    );
    if (!pps.numeral && pps.postDelimiterBackspace && !postDelimiterAfter) {
      value = Util.headStr(
        value,
        value.length - pps.postDelimiterBackspace.length
      );
    }

    if (pps.phone) {
      if (pps.prefix && (!pps.noImmediatePrefix || value.length)) {
        pps.result =
          pps.prefix +
          pps.phoneFormatter.format(value).slice(pps.prefix.length);
      } else {
        pps.result = pps.phoneFormatter.format(value);
      }
      this.updateValueState();
      return;
    }

    if (pps.numeral) {
      if (pps.prefix && pps.noImmediatePrefix && value.length === 0) {
        pps.result = "";
      } else {
        pps.result = pps.numeralFormatter.format(value);
      }
      this.updateValueState();
      return;
    }

    if (pps.date) {
      value = pps.dateFormatter.getValidatedDate(value);
    }

    if (pps.time) {
      value = pps.timeFormatter.getValidatedTime(value);
    }

    value = Util.stripDelimiters(value, pps.delimiter, pps.delimiters);
    value = Util.getPrefixStrippedValue(
      value,
      pps.prefix,
      pps.prefixLength,
      pps.result,
      pps.delimiter,
      pps.delimiters,
      pps.noImmediatePrefix,
      pps.tailPrefix,
      pps.signBeforePrefix
    );
    value = pps.numericOnly ? Util.strip(value, /[^\d]/g) : value;
    value = pps.uppercase ? value.toUpperCase() : value;
    value = pps.lowercase ? value.toLowerCase() : value;

    if (pps.prefix) {
      if (pps.tailPrefix) {
        value = value + pps.prefix;
      } else {
        value = pps.prefix + value;
      }

      if (pps.blocksLength === 0) {
        pps.result = value;
        this.updateValueState();
        return;
      }
    }

    if (pps.creditCard) {
      this.updateCreditCardPropsByValue(value);
    }

    value = Util.headStr(value, pps.maxLength);

    pps.result = Util.getFormattedValue(
      value,
      pps.blocks,
      pps.blocksLength,
      pps.delimiter,
      pps.delimiters,
      pps.delimiterLazyShow
    );

    this.updateValueState();
  }

  updateCreditCardPropsByValue(value) {
    const pps = this.properties;

    if (Util.headStr(pps.result, 4) === Util.headStr(value, 4)) {
      return;
    }

    const creditCardInfo = CreditCardDetector.getInfo(
      value,
      pps.creditCardStrictMode
    );

    pps.blocks = creditCardInfo.blocks;
    pps.blocksLength = pps.blocks.length;
    pps.maxLength = Util.getMaxLength(pps.blocks);

    if (pps.creditCardType !== creditCardInfo.type) {
      pps.creditCardType = creditCardInfo.type;
      pps.onCreditCardTypeChanged.call(this, pps.creditCardType);
    }
  }

  updateValueState() {
    const pps = this.properties;

    if (!this.element) return;

    const endPos = this.element.selectionEnd;
    const oldValue = this.element.value;
    const newValue = pps.result;

    const newEndPos = Util.getNextCursorPosition(
      endPos,
      oldValue,
      newValue,
      pps.delimiter,
      pps.delimiters
    );

    if (this.isAndroid) {
      window.setTimeout(() => {
        this.element.value = newValue;
        Util.setSelection(this.element, newEndPos, pps.document);
        this.callOnValueChanged();
      }, 1);
      return;
    }

    this.element.value = newValue;
    Util.setSelection(this.element, newEndPos, pps.document);
    this.callOnValueChanged();
  }

  callOnValueChanged() {
    const pps = this.properties;

    pps.onValueChanged.call(this, {
      target: {
        name: this.element.name,
        value: pps.result,
        rawValue: this.getRawValue()
      }
    });
  }

  setRawValue(value) {
    const pps = this.properties;

    value = value !== undefined && value !== null ? value.toString() : "";

    if (pps.numeral) {
      value = value.replace(".", pps.numeralDecimalMark);
    }

    pps.postDelimiterBackspace = false;
    this.element.value = value;
    this.onInput(value);
  }

  getRawValue() {
    const pps = this.properties;
    let rawValue = this.element.value;

    if (pps.rawValueTrimPrefix) {
      rawValue = Util.getPrefixStrippedValue(
        rawValue,
        pps.prefix,
        pps.prefixLength,
        pps.result,
        pps.delimiter,
        pps.delimiters,
        pps.noImmediatePrefix,
        pps.tailPrefix,
        pps.signBeforePrefix
      );
    }

    if (pps.numeral) {
      rawValue = pps.numeralFormatter.getRawValue(rawValue);
    } else {
      rawValue = Util.stripDelimiters(rawValue, pps.delimiter, pps.delimiters);
    }

    return rawValue;
  }

  getISOFormatDate() {
    const pps = this.properties;
    return pps.date ? pps.dateFormatter.getISOFormatDate() : "";
  }

  getISOFormatTime() {
    const pps = this.properties;
    return pps.time ? pps.timeFormatter.getISOFormatTime() : "";
  }

  getFormattedValue() {
    return this.element.value;
  }

  destroy() {
    this.element.removeEventListener("input", this.onChangeListener);
    this.element.removeEventListener("keydown", this.onKeyDownListener);
    this.element.removeEventListener("focus", this.onFocusListener);
    this.element.removeEventListener("cut", this.onCutListener);
    this.element.removeEventListener("copy", this.onCopyListener);
  }

  toString() {
    return "[Cleave Object]";
  }
}

// Export for LWC
export {
  Cleave,
  Util,
  CreditCardDetector,
  DateFormatter,
  TimeFormatter,
  NumeralFormatter,
  PhoneFormatter
};
export default Cleave;
