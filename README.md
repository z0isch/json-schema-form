# JSON Schema Form

A web component that generates HTML forms from JSON Schema documents. Built with [Lit](https://lit.dev/).

## Installation

### From GitHub (npm/pnpm/yarn)

```bash
# npm
npm install github:YOUR_USERNAME/json-schema-form

# pnpm
pnpm add github:YOUR_USERNAME/json-schema-form

# yarn
yarn add github:YOUR_USERNAME/json-schema-form
```

### CDN (via jsDelivr)

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/gh/z0isch/json-schema-form@v0.1.0/dist/json-schema-form.js"
></script>
```

### Direct Download

Download `dist/json-schema-form.js` from this repository and include it in your project.

## Usage

### Basic Example

```html
<!DOCTYPE html>
<html>
  <head>
    <script type="module" src="./dist/json-schema-form.js"></script>
  </head>
  <body>
    <json-schema-form id="my-form"></json-schema-form>

    <script type="module">
      const schema = {
        title: "Contact Form",
        type: "object",
        required: ["name", "email"],
        properties: {
          name: {
            type: "string",
            title: "Your Name",
            minLength: 2,
          },
          email: {
            type: "string",
            title: "Email",
            format: "email",
          },
          message: {
            type: "string",
            title: "Message",
            maxLength: 500,
          },
        },
      };

      const form = document.getElementById("my-form");
      form.setAttribute("schema", JSON.stringify(schema));

      // Listen for form submission
      form.addEventListener("json-schema-form-submit", (e) => {
        console.log("Form data:", e.detail.value);
      });
    </script>
  </body>
</html>
```

### With a JavaScript Module Bundler

```javascript
import "json-schema-form";

const schema = {
  type: "object",
  properties: {
    username: { type: "string", minLength: 3 },
    age: { type: "integer", minimum: 0 },
  },
};

// The component auto-registers as <json-schema-form>
document.querySelector("json-schema-form").schema = JSON.stringify(schema);
```

## Attributes & Properties

| Attribute            | Property           | Type      | Default     | Description                        |
| -------------------- | ------------------ | --------- | ----------- | ---------------------------------- |
| `schema`             | `schema`           | `string`  | `""`        | JSON Schema as a JSON string       |
| `validate-on-change` | `validateOnChange` | `boolean` | `false`     | Validate on every input change     |
| `show-submit`        | `showSubmit`       | `boolean` | `true`      | Show the submit button             |
| `submit-text`        | `submitText`       | `string`  | `"Submit"`  | Text for the submit button         |
| —                    | `value`            | `unknown` | `undefined` | Current form value (property only) |

## Events

| Event                     | Detail                          | Description                                   |
| ------------------------- | ------------------------------- | --------------------------------------------- |
| `json-schema-form-submit` | `{ value }`                     | Fired when form is submitted with valid data  |
| `json-schema-form-change` | `{ value, path, changedValue }` | Fired on any value change                     |
| `json-schema-form-error`  | `{ errors }`                    | Fired when validation errors occur            |
| `json-schema-form-ready`  | `{ schema }`                    | Fired when schema is parsed and form is ready |

## Methods

| Method        | Description                                    |
| ------------- | ---------------------------------------------- |
| `validate()`  | Manually trigger validation, returns `boolean` |
| `reset()`     | Reset form to default values                   |
| `submit()`    | Programmatically submit the form               |
| `getSchema()` | Get the parsed schema object                   |

## Supported JSON Schema Features

### Types

- `string` — text inputs with `minLength`, `maxLength`, `pattern`
- `number` / `integer` — number inputs with `minimum`, `maximum`, `multipleOf`
- `boolean` — checkboxes
- `object` — nested forms with `properties`, `required`, `additionalProperties`
- `array` — dynamic lists with `items`, `minItems`, `maxItems`
- `null` — null display
- `enum` — select dropdowns
- `const` — readonly display

### String Formats

All standard JSON Schema formats with specialized inputs:

- `date`, `time`, `date-time` — native date/time pickers
- `email` — email input with icon
- `uri`, `uri-reference` — URL input with "open link" button
- `uuid` — monospace input with "generate" button
- `ipv4`, `ipv6` — IP address inputs
- `hostname` — hostname input
- `duration` — ISO 8601 duration input
- `regex` — regex input with delimiters
- `json-pointer` — JSON pointer input

### Composition

- `oneOf` / `anyOf` — schema selector dropdown
- `$ref` — reference resolution (including circular reference detection)
- `if` / `then` / `else` — conditional schemas
- `dependentSchemas` — schemas that apply when a property exists

### Advanced Object Features

- `additionalProperties` — add custom properties
- `patternProperties` — properties matching regex patterns
- `propertyNames` — validate property name format
- `minProperties` / `maxProperties` — property count limits

### Advanced Array Features

- `prefixItems` — tuple validation (fixed-position schemas)
- `items` — schema for additional items
- `minItems` / `maxItems` — array length limits

## Styling

The component uses CSS custom properties for theming:

```css
json-schema-form {
  --jsf-color-primary: #6366f1;
  --jsf-color-error: #ef4444;
  --jsf-font-family: system-ui, sans-serif;
}
```

### CSS Parts

Style internal elements using `::part()`:

```css
json-schema-form::part(form) {
  /* form element */
}
json-schema-form::part(field) {
  /* field containers */
}
json-schema-form::part(label) {
  /* labels */
}
json-schema-form::part(input) {
  /* inputs */
}
json-schema-form::part(error) {
  /* error messages */
}
json-schema-form::part(actions) {
  /* button container */
}
```

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build library
pnpm build

# Build demo site
pnpm build:site
```

## License

MIT
