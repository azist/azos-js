# Parts Definitions

The following shows all available Attributes/Properties for the Azos Parts.

### Button `<az-button>`

| Property | Type | Definition | Valid Value(s) |
| -------- | ---- | ---------- | -------------- |
| **@click** | _Javascript_ | Action or function performed when button is clicked | _any_ |
| **ID** | _String_ | Unique identifier | _any_ |
| **isDisabled** | _Boolean_ | If listed, disables the part, removing all interactivity | _isDisabled_ |
| **Rank** | _Number_ or _String_ | Numerical or descriptive size. **Default: 3** | _1, 2, 3, 4, 5, 6_ **or** _huge, large, normal, medium, small, tiny_ |
| **Status** | _String_ | Color-coded status | _ok, info, warn, alert, error_ |
| **Title** | _String_ | Button's label | _any_ |

---

### Radio Group `<az-radio-group>`

> The following properties are defined within the `<az-radio-group>` tag and apply uniformly to all child `<az-radio-option>` elements.

| Property | Type | Definition | Valid Value(s) |
| -------- | ---- | ---------- | -------------- |
| **ID** | _String_ | Unique identifier | _any_ |
| **isDisabled** | _Boolean_ | If listed, disables the part, removing all interactivity | _isDisabled_ |
| **isRequired** | _Boolean_ | _For validation use._ If listed, the field must be completed before the form data can be submitted. | _isRequired_ |
| **itemType** | _String_ | Determines if each `<az-radio-option>` is rendered as a `radio` button or a `switch`. **Default: radio** | _radio, switch_ |
| **Rank** | _Number_ or _String_ | Numerical or descriptive size. **Default: 3** | _1, 2, 3, 4, 5, 6_ **or** _huge, large, normal, medium, small, tiny_ |
| **Status** | _String_ | Color-coded status | _ok, info, warn, alert, error_ |
| **Title** | _String_ | Main prompt for the radio group | _any_ |
| **titlePosition** | _String_ | Position of each `<az-radio-option>` title oriented to its radio button or switch. **Default: mid-left** | _top-left, top-center, top-right, mid-left, mid-right, bottom-left, bottom-center, bottom-right_ |
| **titleWidth** | _Number_ | When titlePosition is `mid-left` or `mid-right`, defines the percentage width of each `<az-radio-option>` title. **Default: 80** | _number between 0 and 100_ |

#### Radio Group Option `<az-radio-option>`

> This sub-part has no properties. The text of each option appears between its opening and closing tags. `<az-radio-option>Radio Option Text</az-radio-option>`

---

### Checkbox `<az-checkbox>`

| Property | Type | Definition | Valid Value(s) |
| -------- | ---- | ---------- | -------------- |
| **ID** | _String_ | Unique identifier | _any_ |
| **isDisabled** | _Boolean_ | If listed, disables the part, removing all interactivity | _isDisabled_ |
| **isRequired** | _Boolean_ | _For validation use._ If listed, the field must be completed before the form data can be submitted. | _isRequired_ |
| **itemType** | _String_ | Determines if this part is rendered as a `check` or a `switch`. **Default: check** | _check, switch_ |
| **Rank** | _Number_ or _String_ | Numerical or descriptive size. **Default: 3** | _1, 2, 3, 4, 5, 6_ **or** _huge, large, normal, medium, small, tiny_ |
| **Status** | _String_ | Color-coded status | _ok, info, warn, alert, error_ |
| **Title** | _String_ | Main prompt for the radio group | _any_ |
| **titlePosition** | _String_ | Position of this part's title oriented to its checkbox or switch. **Default: mid-left** | _top-left, top-center, top-right, mid-left, mid-right, bottom-left, bottom-center, bottom-right_ |
| **titleWidth** | _Number_ | When titlePosition is `mid-left` or `mid-right`, defines the percentage width of this part's title. **Default: 80** | _number between 0 and 100_ |

---

### Text Field `<az-text-field>`

| Property | Type | Definition | Valid Value(s) |
| -------- | ---- | ---------- | -------------- |
| **alignValue** | _String_ | Aligns the value within the input field. **Default: left** | _left, center, right_ |
| **contentWidth** | _Number_ | When `titlePosition` is `mid-left` or `mid-right`, defines the percentage width of the content area (i.e. input field or textarea). **Default: 40** | _number between 0 and 100_ |
| **Height** | _Number_ | If `itemType` is `long` or `textarea`, this property defines the height of the `textarea` in rows. **Default: 4** | _positive integer_ |
| **ID** | _String_ | Unique identifier | _any_ |
| **isDisabled** | _Boolean_ | If listed, disables the part, removing all interactivity | _isDisabled_ |
| **isReadonly** | _Boolean_ | If listed, disables the part while allowing the user to highlight the value. | _isReadonly_ |
| **isRequired** | _Boolean_ | _For validation use._ If listed, the field must be completed before the form data can be submitted. | _isRequired_ |
| **itemType** | _String_ | Determines if this part is rendered as an `<input type="text">`, `<input type="password">`, or a `<textarea>`. **Default: text** | _[multiline, long, textarea], [password, pass, pw, masked], text_ |
| **maxChar** | _Number_ | Defines the maximum limit of characters allowed in this part's value | _integer_ |
| **minChar** | _Number_ | _For validation use._ Defines the minimum limit of characters allowed in this part's value | _integer_ |
| **Placeholder** | _String_ | Semi-transparent text displayed within the input field. | _any_ |
| **Rank** | _Number_ or _String_ | Numerical or descriptive size. **Default: 3** | _1, 2, 3, 4, 5, 6_ **or** _huge, large, normal, medium, small, tiny_ |
| **Status** | _String_ | Color-coded status | _ok, info, warn, alert, error_ |
| **Title** | _String_ | Main prompt for the radio group | _any_ |
| **titlePosition** | _String_ | Position of this part's title oriented to its field. **Default: top-left** | _top-left, top-center, top-right, mid-left, mid-right, bottom-left, bottom-center, bottom-right_ |
| **titleWidth** | _Number_ | When titlePosition is `mid-left` or `mid-right`, defines the percentage width of this part's title. **Default: 80** | _number between 0 and 100_ |
| **Value** | _String_ | Part's default/starting value. | _any_ |

---

### Select `<az-select>`

| Property | Type | Definition | Valid Value(s) |
| -------- | ---- | ---------- | -------------- |
| **alignValue** | _String_ | Aligns the value within the input field. **Default: left** | _left, center, right_ |
| **contentWidth** | _Number_ | When `titlePosition` is `mid-left` or `mid-right`, defines the percentage width of the content area (i.e. input field or textarea). **Default: 40** | _number between 0 and 100_ |
| **ID** | _String_ | Unique identifier | _any_ |
| **isDisabled** | _Boolean_ | If listed, disables the part, removing all interactivity | _isDisabled_ |
| **isMultiple** | _Boolean_ | If listed, allows user to select multiple options. **Not recommended for mobile use.** | _isMultiple_ |
| **isReadonly** | _Boolean_ | If listed, disables the part while allowing the user to highlight the value. | _isReadonly_ |
| **isRequired** | _Boolean_ | _For validation use._ If listed, the field must be completed before the form data can be submitted. | _isRequired_ |
| **Rank** | _Number_ or _String_ | Numerical or descriptive size. **Default: 3** | _1, 2, 3, 4, 5, 6_ **or** _huge, large, normal, medium, small, tiny_ |
| **Status** | _String_ | Color-coded status | _ok, info, warn, alert, error_ |
| **Title** | _String_ | Main prompt for the radio group | _any_ |
| **titlePosition** | _String_ | Position of this part's title oriented to its field. **Default: top-left** | _top-left, top-center, top-right, mid-left, mid-right, bottom-left, bottom-center, bottom-right_ |
| **titleWidth** | _Number_ | When titlePosition is `mid-left` or `mid-right`, defines the percentage width of this part's title. **Default: 40** | _number between 0 and 100_ |
| **Value** | _String_ | Part's default/starting value. | _any value of this part's list of `<az-select-option>`_ |

#### Select Option `<az-select-option>`

> This sub-part has one property. The text of each option appears between its opening and closing tags. `<az-select-option>Select Option Text</az-select-option>`

| Property | Type | Definition | Valid Value(s) |
| -------- | ---- | ---------- | -------------- |
| **Value** | _String_ | Sub-part's value. When selected, overrides its parent's existing value. | _any_ |

---

### Slider `<az-slider>`

| Property | Type | Definition | Valid Value(s) |
| -------- | ---- | ---------- | -------------- |
| **contentWidth** | _Number_ | When `titlePosition` is `mid-left` or `mid-right`, defines the slider's. **Default: 40** | _number between 0 and 100_ |
| **displayValue** | _Boolean_ | If listed, displays the slider's current value and value description. | _displayValue_ |
| **ID** | _String_ | Unique identifier | _any_ |
| **isDisabled** | _Boolean_ | If listed, disables the part, removing all interactivity | _isDisabled_ |
| **numTicks** | _Number_ | Applies a number evenly-spaced tick marks to the slider | _Number_ |
| **orientation** | _String_ | Defines whether the slider is horizontal or vertical. | _horizontal, vertical_ |
| **rangeMax** | _Number_ | The slider's maximum limit | _Number_ |
| **rangeMin** | _Number_ | The slider's minimum limit | _Number_ |
| **rangeStep** | _Number_ | Interval that controls the slider's granularity. **Default: 1** | _Number_ |
| **Rank** | _Number_ or _String_ | Numerical or descriptive size. **Default: 3** | _1, 2, 3, 4, 5, 6_ **or** _huge, large, normal, medium, small, tiny_ |
| **Status** | _String_ | Color-coded status | _ok, info, warn, alert, error_ |
| **Title** | _String_ | Main prompt for the radio group | _any_ |
| **titlePosition** | _String_ | Position of this part's title oriented to its field. **Default: top-left** | _top-left, top-center, top-right, mid-left, mid-right, bottom-left, bottom-center, bottom-right_ |
| **titleWidth** | _Number_ | When titlePosition is `mid-left` or `mid-right`, defines the percentage width of this part's title. **Default: 40** | _number between 0 and 100_ |
| **Value** | _Number_ | Part's default/starting value. | _Number_ |
| **valueLabel** | _String_ | Description for value that is shown when `displayValue` is listed. | _any_ |

---
