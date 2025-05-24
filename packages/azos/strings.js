/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as CC from "./coreconsts.js";
import * as types from "./types.js";
import * as aver from "./aver.js";

/**
 * Returns true if the argument is an undefined, null, zero length or an empty string.
 * Treats non-string types as coerced, e.g. isEmpty(false)===false because false.toString()==="false"
 * @param {string} str String to test
 */
export function isEmpty(str) {
  if (!types.isAssigned(str)) return true;// (!str) is NOT the same test i.e. str=(bool)false is a valid "string"
  return (str.length === 0 || /^\s*$/.test(str));
}

/**
 * Returns either a string or dflt if empty. Coerces other types
 */
export function dflt(str, ...dflt) {
  str = asString(str);
  if (isEmpty(str)) {
    for (let ds of dflt) {
      const d = asString(ds);
      if (!isEmpty(d)) return d;
    }
  }
  return str;
}

/**
 * Returns either a string or dflt object (whatever is passed without string conversion) if empty. Coerces other types of value only (not defaults)
 */
export function dfltObject(str, ...dflt) {
  str = asString(str);
  if (isEmpty(str)) {
    for (let ds of dflt) {
      if (ds) return ds;
    }
  }
  return str;
}


/**
 * Ensures that the result is always a string representation of a primitive v, an empty one for null or undefined (unless canUndef is true).
 * Non-string values are coerced using v.toString(), objects are NOT JSONized
 * @param {*} v Value
 * @param {boolean} canUndef True to preserve undefined
 */
export function asString(v, canUndef = false) {
  if (v === undefined) return canUndef ? undefined : "";
  if (v === null) return "";
  if (typeof (v) === "string") return v;//do not use types.isString as new String("abc")!=="abc" :)
  return v.toString();
}

/**
 * Trims whitespace and CR LF from string ends. The non-string values are coerced to string
 * @param {*} str to trim
 */
export function trim(str) {
  str = asString(str);
  if (str.trim) return str.trim();
  return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
}

/**
 * Trims whitespace and CR LF from the left side of the string. The non-string values are coerced to string
 * @param {*} str to trim
 */
export function trimLeft(str) {
  str = asString(str);
  return str.replace(/^\s+/, "");
}

/**
 * Trims whitespace and CR LF from the right side of the string.  The non-string values are coerced to string
 * @param {*} str to trim
 */
export function trimRight(str) {
  str = asString(str);
  return str.replace(/\s+$/, "");
}

/**
 * Returns true if the string starts with the specified segment
 * @param {*} str string that starts with segment
 * @param {string} seg Segment that string should start with
 * @param {boolean} [scase=false] Sense case
 * @param {int} [idx=0] search start index
 */
export function startsWith(str, seg, scase = false, idx = 0) {
  str = asString(str);
  seg = asString(seg);
  if (!scase) {
    str = str.toLowerCase();
    seg = seg.toLowerCase();
  }
  return str.startsWith(seg, idx);
}

/**
 * Returns true if the supplied string matches a specified pattern that can contain multiple char span (*) wildcards and
 *  multiple single-char (?) wildcards.
 *
 * @param {string|null} str the string to match
 * @param {string|null} pattern the pattern to match
 * @param {string|undefined} wc the wildcard for multiple characters (default: *)
 * @param {string|undefined} wsc the wildcard for a single character (default: ?)
 * @param {*} senseCase whether to consider case sensitivity (default: false)
 * @returns  {boolean} true if the string matches the given pattern
 */
export function matchPattern(str, pattern, wc = '*', wsc = '?', senseCase = false) {

  const snws = isNullOrWhiteSpace(str);
  const pnws = isNullOrWhiteSpace(pattern);

  // quick pattern match for "*" = match anything quickly
  if (!pnws && pattern.length === 1 && pattern[0] === wc) return true;

  if (snws && pnws) return true;
  if (snws || pnws) return false;

  let istr = 0;
  let ipat = 0;

  let pistr = str.length;
  let pipat = pattern.length;

  while (istr < str.length) {
    for (; istr < str.length && ipat < pattern.length; istr++, ipat++) {
      const pc = pattern[ipat];
      if (pc === wc) { // '*' wildcard
        if (ipat === pattern.length - 1) return true; // final char in pattern is *
        pistr = istr;
        pipat = ipat;
        istr--;
        continue;
      }

      if (pc === wsc) continue;
      if (charEqual(pc, str[istr], senseCase)) continue;

      ipat = pipat - 1; // same pattern
      istr = pistr; // next char
    }

    // eat trailing ****
    while (ipat < pattern.length && pattern[ipat] === wc) ipat++;
    if (istr === str.length && ipat === pattern.length) return true;
    ipat = pipat;
    pistr++;
    istr = pistr;
  }
  return false;
}

/**
 * @param {string} str the string to check
 * @returns true if str is null, undefined, empty string, or whitespace
 */
export function isNullOrWhiteSpace(str) {
  if (str === null || str === undefined || str === "" || str.trim().length === 0) return true;
  return false;
}

/**
 * Determine if a and b are equal characters.
 * @param {char} a
 * @param {char} b
 * @param {boolean} senseEqual true to strictly compare
 */
export function charEqual(a, b, senseEqual) {
  if (senseEqual) {
    return a === b;
  }
  return a?.toLowerCase() === b?.toLowerCase();
}


/**
 * Returns true if the string equals one of the strings in the list of values supplied either as an array or '|' or ';' separated string
 * @param {string} str string to test. other types are coerced to string
 * @param {string[]|string} values array of values to test against, or a '|' or ';' delimited string of values
 */
export function isOneOf(str, values, senseCase = false) {
  if (!types.isAssigned(str)) return false;
  if (!types.isAssigned(values)) return false;

  str = trim(str);

  if (types.isString(values)) {
    values = values.split(/[|,;]/).filter(s => s.length > 0);
  }

  if (!senseCase) str = str.toLowerCase();

  for (let i in values) {
    let e = trim(values[i]);
    if (!senseCase) e = e.toLowerCase();
    if (str === e) return true;
  }

  return false;
}

/**
 * Truncates/caps a string at the specified maxLen optionally adding ellipsis at the end.
 * The non-string input values are coerced to string
 * @param {*} str Original string source
 * @param {int} maxLen The maximum length
 * @param {*} [ending] The ending of the capped string, ellipsis is used by default
 */
export function truncate(str, maxLen, ending) {
  str = asString(str);
  if (!(maxLen > 0)) return str;// not the same maxLength<=0
  let len = str.length;
  if (len <= maxLen) return str;
  ending = asString(ending);
  return str.substr(0, maxLen - ending.length) + ending;
}


/**
 * Provides a textual representation of a value, suitable for report in error logs, exceptions, etc.
 * @param {*} v value to describe
 * @param {int} [maxLen=64] impose maximum length on the resulting description
 */
export function describe(v, maxLen = 64) {
  if (v === undefined) return CC.UNDEFINED;
  if (v === null) return CC.NULL;

  let t = types.describeTypeOf(v);
  let subs = v.length ? `[${v.length}]` : "";

  let d = CC.UNKNOWN;
  if (types.isDate(v))
    d = CC.GLOBALS.DEFAULT_INVARIANT.formatDateTime(v);
  else if (types.isString(v))
    d = `"${v}"`;
  else if (types.isObjectOrArray(v))
    d = JSON.stringify(v);
  else
    d = v.toString();

  d = truncate(d, maxLen, CC.ELLIPSIS);
  return `(${t}${subs})${d}`;
}

/** Regular expression that parses out <<format tokens>> */
export const REXP_FORMAT = /<<(.*?)>>/g;

/**
 * Expands formatting arguments
 * @param {*} v A format string with tokens: <<path[::format[{format-args-json}]>>. Path is the same as used in types.nav() to address sub/properties of the args object
 * @param {*} args Arguments object: either a map or array
 * @example
 *  format(`DOB is: <<dob::ld{"dtFormat": "'ShortDate"}>> Salary: <<salary::lm{"iso": "?salary_iso"}>>`, {dob: new Date(1980, 1, 1), salary: 120000, salary_iso: "usd"})
 *  returns "DOB is: 01/01/1980 Salary: $120,000.00"
 */
export function format(v, args, localizer = null) {
  v = asString(v);
  if (!args) return v;
  if (!types.isObjectOrArray(args))
    throw new types.AzosError(".format(args) must be null, object or array", "format()");

  if (!localizer) localizer = CC.GLOBALS.DEFAULT_INVARIANT;

  const fmap = (s, token) => {
    let key = token;
    let fmt = "";
    let fmta = null;
    const i = token.indexOf("::");
    if (i > 0) {
      key = token.substring(0, i);
      fmt = token.substring(i + 2);
      const j = fmt.indexOf("{");
      if (j > 1) {
        try {
          fmta = JSON.parse(fmt.substr(j));
        } catch (e) {
          throw new types.AzosError(`.format('.. ${fmt} ..') Error parsing token format fragment: ${e.message}`, "format()");
        }
        fmt = fmt.substring(0, j);
      }
    }

    const get = (path) => types.nav(args, path).result;


    let tv = get(key);

    switch (fmt) {
      case "ld": { //localized date-time
        if (fmta === null) fmta = {};
        fmta.dt = tv;
        return localizer.formatDateTime(fmta);
      }
      case "lm": { //localized money
        if (fmta === null) fmta = {};
        fmta.amt = tv;
        if (isEmpty(fmta.iso)) throw new types.AzosError(".format() is missing currency iso arg: lm{iso: 'currency-code' | '?key'}", "format()");
        if (fmta.iso.startsWith("?")) {
          fmta.iso = asString(get(fmta.iso.substr(1)));
        }
        return localizer.formatCurrency(fmta);
      }
      case "tc": { //type cast
        if (fmta === null) throw new types.AzosError(".format() is missing typecast arg: tc{tm: 'type-moniker'}", "format()");
        tv = types.cast(tv, fmta.tm);
      }
    }
    return asString(tv);
  };

  return v.replace(REXP_FORMAT, fmap);
}

/**
 * Returns true if the value represents a valid email address.
 * 2014 Note: for now we only accept latin, diacritics, greek and cyryllic chars for emails.
 * @param {*} v Email Address
 */
export function isValidEMail(v) {
  v = asString(v);
  if (isEmpty(v)) return false;
  const iat = v.indexOf("@");
  if (iat < 1 || iat === v.length - 1) return false;

  if (v.indexOf("@", iat + 1) >= 0) return false;//duplicate @

  const ldot = v.lastIndexOf(".");
  const pass = (ldot > iat + 2) && (ldot + 2 <= v.length);
  if (!pass) return false;

  let wasDot = false;
  for (let i = 0; i < v.length; i++) {
    const c = v[i];
    if (c === ".") {
      if (wasDot) return false;
      wasDot = true;
      continue;
    } else wasDot = false;

    if (c === "@" || c === "-" || c === "_") continue;
    if (!isValidScreenNameLetterOrDigit(c)) return false;
  }

  return true;
}

const SCREEN_NAME_EXTRA =
  "ёЁÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥ";

function isValidScreenNameLetter(c) {
  return ((c >= "A" && c <= "Z") ||
    (c >= "a" && c <= "z") ||
    (c >= "Α" && c <= "Ω") ||
    (c >= "α" && c <= "ω") ||
    (c >= "А" && c <= "Я") ||
    (c >= "а" && c <= "я") ||
    (SCREEN_NAME_EXTRA.indexOf(c) >= 0));
}

function isValidScreenNameLetterOrDigit(c) {
  return isValidScreenNameLetter(c) || (c >= "0" && c <= "9");
}

function isValidScreenNameSeparator(c) {
  return c === "." || c === "-" || c === "_";
}

/**
 * Returns true if the string contains a valid Screen Name.
 * Screen names are used for making primary actor (user/room/group etc...) IDS(names)
 * which are always visible (hence the name "screen/stage name of a person") and can be used for emails,
 * for example "my-name" => "my-name@domain.com".
 * Screen names are defined as strings starting from a letter, then followed by letters or digints separated by a single
 * hyphen, dot or underscore
 * @param {*} v A string value representing a s Screen Name
 * @example
 *  Valid names: "my-name", "name1980", "my.name", "alex-bobby-1980"
 *  Invalid names: "-my-name", "1980name", "my-.name", "name."
 */
export function isValidScreenName(v) {
  v = asString(v);
  if (isEmpty(v)) return false;
  v = trim(v);
  if (v.length === 0) return false;
  var wasSeparator = false;
  for (let i = 0; i < v.length; i++) {
    const c = v[i];
    if (i === 0) {
      if (!isValidScreenNameLetter(c)) return false;
      continue;
    }

    if (isValidScreenNameSeparator(c)) {
      if (wasSeparator) return false;
      wasSeparator = true;
      continue;
    }
    if (!isValidScreenNameLetterOrDigit(c)) return false;
    wasSeparator = false;
  }
  return !wasSeparator;
}


/**
 * Parses and formats the supplied string per US telephone number standard: (999) 999-9999x9999
 * The numbers starting with +(international) returned as-is
 * @param {*} v
 */
export function normalizeUSPhone(v) {
  v = trim(asString(v));
  if (isEmpty(v)) return "";

  if (v.startsWith("+")) return v; //international phone, just return as-is

  let isArea = false;
  let isExt = false;
  let area = "";
  let number = "";
  let ext = "";

  for (var i = 0; i < v.length; i++) {
    const chr = v[i];

    if (!isArea && chr === "(" && area.length === 0) {
      isArea = true;
      continue;
    }

    if (isArea && chr === ")") {
      isArea = false;
      continue;
    }

    if (isArea && area.length === 3)
      isArea = false;


    if (number.length > 0 && !isExt) { //check extention
      if (chr === "x" || chr === "X" || (chr === "." && number.length > 6)) {
        isExt = true;
        continue;
      }

      let trailer = v.substring(i).toUpperCase();

      if (startsWith(trailer, "EXT") && number.length >= 7) {
        isExt = true;
        i += 2;
        continue;
      }

      if (startsWith(trailer, "EXT.") && number.length >= 7) {
        isExt = true;
        i += 3;
        continue;
      }
    }

    if (!isMultilingualLetterOrDigit(chr)) continue;

    if (isArea) area += chr;
    else {
      if (isExt)
        ext += chr;
      else
        number += chr;
    }
  }//for

  while (number.length < 7) number += "?";

  if (area.length === 0) {
    if (number.length >= 10) {
      area = number.substring(0, 3);
      number = number.substring(3);
    }
    else
      area = "???";
  }

  if (number.length > 7 && ext.length === 0) {
    ext = number.substring(7);
    number = number.substring(0, 7);
  }

  number = number.substring(0, 3) + "-" + number.substring(3);

  if (ext.length > 0) ext = "x" + ext;

  return "(" + area + ") " + number + ext;
}

/**
 * @param {string} v the phone number to test
 * @returns true if the phone number is valid
 */
export function isValidPhone(v) {
  if (isEmpty(v)) return false;
  if (v.length < 7) return false;

  let hasFirstParenthesis = false;
  let hasSecondParenthesis = false;
  let prevIsSpecial = false;
  let area = false;
  let inParenthesis = false;

  for (let i = 0; i < v.length; i++) {
    let c = v.charAt(i);

    if (i === 0) {
      if (c === ' ') return false;
      if (c === '+') {
        prevIsSpecial = true;
        continue;
      } else {
        area = true;
      }
    }

    if (i === v.length - 1 && !isLetterOrDigit(c)) return false;

    if (c === '(') {
      if (hasFirstParenthesis || hasSecondParenthesis || prevIsSpecial) return false;
      hasFirstParenthesis = true;
      inParenthesis = true;
      continue;
    }

    if (c === ')') {
      if (hasSecondParenthesis || prevIsSpecial) return false;
      hasSecondParenthesis = true;
      prevIsSpecial = true;
      inParenthesis = false;
      continue;
    }

    if (c === '-' || c === '.') {
      if (prevIsSpecial || inParenthesis) return false;
      prevIsSpecial = true;
      continue;
    }

    if (c === ' ') {
      if ((prevIsSpecial && v.charAt(i - 1) !== ')') || inParenthesis) return false;
      prevIsSpecial = true;
      continue;
    }

    if (area) {
      for (let j = 0; j < 3 && i < v.length - 2; j++) {
        c = v.charAt(i + j);
        if (!isDigit(c)) return false;
      }

      if (inParenthesis && v.charAt(i + 3) !== ')') return false;
      area = false;
      i = i + 2;
      continue;
    }

    if (!isLetterOrDigit(c)) return false;
    prevIsSpecial = false;
  }

  if (inParenthesis || (hasSecondParenthesis && !hasFirstParenthesis)) return false;

  return true;
}

/**
 * @param {char} char the character to test
 * @returns true if character is a digit [0-9]
 */
export function isDigit(char) {
  return /^[0-9]$/.test(char);
}

/**
 * @param {string} char the character to test
 * @returns true if char is a letter [A-Za-z]
 */
export function isLetter(char) {
  return /^[A-Za-z]$/.test(char);
}

/**
 * @param {string} char the character to test
 * @returns true if char is a letter [A-Za-z] or a digit [0-9]
 */
export function isLetterOrDigit(char) {
  return isDigit(char) || isLetter(char);
}

/**
 * This method mimics C# in matching English characters [a-zA-Z0-9], accented
 *  and non-English characters [éçα], unicode digits [٥९], and ignores whitespace
 *  and special characters [\s\t@$] after conversion `char.toString();`
 * @param {string} char the character to test
 * @returns true if char is a digit or a letter
 */
export function isMultilingualLetterOrDigit(char) {
  char = char.toString();
  char = char.length ? char.trim() : char;
  if (!char.length || char.length > 1) {
    return false;
  }
  return /\p{L}|\p{N}/u.test(char);
}

const HEX_DIGITS = "0123456789abcdef";

/**
 * Converts an iterable of bytes into a string with hex representation
 * @param {Iterable} buf - iterable of bytes
 * @returns String build from hex representation of bytes; null for null or throws on non-iterable object
 */
export function bufToHex(buf) {
  if (!types.isAssigned(buf)) return null;
  aver.isIterable(buf);

  let r = '';
  for (const one of buf) {
    const v = one & 0xff;
    r += HEX_DIGITS[v >> 4];
    r += HEX_DIGITS[v & 0xf];
  }
  return r;
}


