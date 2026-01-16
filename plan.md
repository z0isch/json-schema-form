# JSON Schema Form - Implementation Plan

A web component that takes a JSON Schema document and produces an HTML form capable of creating valid JSON for the spec.

## Project Overview

- **Framework**: Lit (https://lit.dev/)
- **Language**: TypeScript
- **Usage**: `<json-schema-form schema="JSON Schema as a string" onSubmit=fn></json-schema-form>`
- **Goal**: Support all features of JSON Schema (Draft 2020-12)

---

## Phase 1: Project Setup & Foundation ✅

### 1.1 Initialize Project Structure

- [x] Set up npm project with TypeScript configuration
- [x] Install dependencies: `lit`, TypeScript, build tools (Vite or Rollup)
- [x] Configure `tsconfig.json` for web component development
- [x] Set up dev server for testing
- [x] Create basic project structure:
  ```
  src/
    index.ts              # Main entry point
    json-schema-form.ts   # Main web component
    schema/
      parser.ts           # Schema parsing & normalization
      validator.ts        # Runtime validation
      types.ts            # TypeScript type definitions
    utils/
      json-pointer.ts     # JSON Pointer implementation (RFC 6901)
    styles/
      form-styles.ts      # Shared CSS styles
  ```

### 1.2 Create Base Web Component

- [x] Create `JsonSchemaForm` Lit element class
- [x] Define reactive properties: `schema` (string), `value` (object)
- [x] Define events: `submit`, `change`, `validation-error`, `ready`
- [x] Implement basic schema parsing from string attribute
- [x] Set up CSS custom properties for theming

---

## Phase 2: Core Type Renderers ✅

### 2.1 Primitive Type Renderers

Support the six primitive JSON types from the spec (Section 4.2.1):

- [x] **String Renderer**

  - Basic text input
  - Textarea for longer content (based on `maxLength`)
  - Support for `format` keyword (email, uri, date, time, date-time, etc.)
  - Input attributes: `minLength`, `maxLength`, `pattern`

- [x] **Number Renderer**

  - Number input with step
  - Support `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum`
  - Support `multipleOf` for step attribute
  - Handle both `number` and `integer` types

- [x] **Boolean Renderer**

  - Checkbox input
  - Consider toggle switch alternative

- [x] **Null Renderer**
  - Display-only indicator (null is a fixed value)
  - Possibly hidden field

### 2.2 Complex Type Renderers

- [x] **Object Renderer**

  - Container for property fields
  - Support `properties` keyword - render each property
  - Support `required` keyword - mark fields as required
  - [x] Support `additionalProperties` - dynamic field addition
  - [x] Support `patternProperties` - fields matching regex patterns
  - [x] Support `propertyNames` - validate added property names
  - [x] Collapsible sections for nested objects

- [x] **Array Renderer**
  - List of items with add/remove controls
  - Support `items` keyword (single schema for all items)
  - [x] Support `prefixItems` keyword (tuple validation)
  - Support `minItems`, `maxItems` constraints
  - [ ] Drag-and-drop reordering (enhancement)
  - [ ] Support `contains` keyword display
  - [ ] Support `uniqueItems` validation UI

---

## Phase 3: Schema Keywords & Validation ✅

### 3.1 Annotation Keywords

- [x] `title` - Display as field label
- [x] `description` - Display as help text/tooltip
- [x] `default` - Pre-populate field value
- [x] `examples` - Show as placeholder or hint
- [x] `deprecated` - Visual indicator (strikethrough, warning)
- [x] `readOnly` - Disable input, display value only
- [x] `writeOnly` - Accept input, but indicate not returned (e.g., passwords)

### 3.2 Validation Keywords

#### String Validation

- [x] `minLength` - Minimum string length
- [x] `maxLength` - Maximum string length
- [x] `pattern` - Regex pattern validation
- [x] `format` - Semantic validation (email, uri, date, etc.)

#### Numeric Validation

- [x] `minimum` - Minimum value (inclusive)
- [x] `maximum` - Maximum value (inclusive)
- [x] `exclusiveMinimum` - Minimum value (exclusive)
- [x] `exclusiveMaximum` - Maximum value (exclusive)
- [x] `multipleOf` - Must be multiple of this value

#### Array Validation

- [x] `minItems` - Minimum array length
- [x] `maxItems` - Maximum array length
- [x] `uniqueItems` - All items must be unique
- [ ] `minContains` / `maxContains` - With `contains` keyword

#### Object Validation

- [x] `required` - List of required properties
- [x] `minProperties` - Minimum property count
- [x] `maxProperties` - Maximum property count
- [x] `dependentRequired` - Conditional required properties

### 3.3 Enumeration & Constant

- [x] `enum` - Render as select dropdown or radio buttons
- [x] `const` - Fixed value (display only, hidden input)

---

## Phase 4: Composition & Conditional Keywords ✅

### 4.1 Logical Composition (Section 10.2.1)

- [x] `allOf` - Validation implemented
- [x] `anyOf` - Validation implemented
- [x] `oneOf` - Validation implemented
- [x] `not` - Validation implemented
- [x] UI for selecting between anyOf/oneOf options

### 4.2 Conditional Schemas (Section 10.2.2)

- [x] `if` / `then` / `else` - Conditional field rendering
  - Evaluate `if` condition on value changes
  - Show/hide `then` or `else` fields dynamically
- [x] `dependentSchemas` - Schema applied when property present

---

## Phase 5: Reference Resolution

### 5.1 Schema References (Section 8.2.3)

- [x] Implement JSON Pointer parser (RFC 6901)
- [x] `$ref` - Resolve and render referenced schema
- [x] `$defs` - Local schema definitions storage
- [x] Handle circular references (detect and prevent infinite loops)
- [ ] `$anchor` - Plain name fragment resolution
- [ ] `$dynamicRef` / `$dynamicAnchor` - Dynamic reference resolution

### 5.2 Schema Identification

- [ ] `$id` - Schema resource identification
- [ ] URI resolution for relative references
- [ ] Support for bundled/compound schema documents

---

## Phase 6: Advanced Features

### 6.1 Unevaluated Keywords (Section 11)

- [ ] `unevaluatedProperties` - Handle properties not covered by other keywords
- [ ] `unevaluatedItems` - Handle array items not covered by other keywords

### 6.2 Format Validation & UI ✅

Implement UI components for standard formats:

- [x] `date` - Date picker
- [x] `time` - Time picker
- [x] `date-time` - DateTime picker
- [x] `email` - Email input with validation
- [x] `uri` / `uri-reference` - URL input
- [x] `iri` / `iri-reference` - IRI input
- [x] `uuid` - UUID input with generate button
- [x] `ipv4` / `ipv6` - IP address input
- [x] `hostname` / `idn-hostname` - Hostname input
- [x] `regex` - Regex pattern input
- [x] `json-pointer` / `relative-json-pointer` - JSON Pointer input
- [x] `duration` - ISO 8601 duration input
- [x] `uri-template` - URI template validation

### 6.3 Content Keywords

- [ ] `contentMediaType` - Indicate expected content type
- [ ] `contentEncoding` - Handle base64, etc.
- [ ] `contentSchema` - Schema for encoded content

---

## Phase 7: User Experience Enhancements

### 7.1 Validation & Error Display

- [x] Real-time validation as user types (with `validate-on-change`)
- [x] Inline error messages per field
- [ ] Summary of all validation errors
- [x] Visual indicators for invalid fields
- [ ] Support custom error messages

### 7.2 Form State Management

- [ ] Track dirty/pristine state per field
- [ ] Track touched/untouched state
- [x] Form-level validity state
- [x] Reset functionality
- [ ] Undo/redo support (optional)

### 7.3 Accessibility (a11y)

- [ ] Proper ARIA labels and descriptions
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Focus management
- [x] Error announcement (role="alert")

### 7.4 Theming & Customization

- [x] CSS custom properties for all colors, spacing, typography
- [ ] Slot support for custom field templates
- [x] Part attributes for external styling
- [ ] Light/dark mode support

---

## Phase 8: API & Events ✅

### 8.1 Component API

```typescript
// ✅ All implemented
interface JsonSchemaFormElement extends HTMLElement {
  // Properties
  schema: string; // JSON Schema as string
  value: unknown; // Current form value
  valid: boolean; // Overall validity
  errors: ValidationError[]; // Current validation errors

  // Methods
  validate(): boolean; // Trigger validation
  reset(): void; // Reset to default/initial values
  submit(): void; // Programmatic submit
  getSchema(): JSONSchema; // Get parsed schema

  // Events
  onsubmit: (value: unknown) => void;
  onchange: (value: unknown) => void;
  onerror: (errors: ValidationError[]) => void;
}
```

### 8.2 Events

- [x] `json-schema-form-submit` - Form submitted with valid data
- [x] `json-schema-form-change` - Value changed
- [x] `json-schema-form-error` - Validation error occurred
- [x] `json-schema-form-ready` - Schema parsed and form rendered

---

## Phase 9: Testing & Documentation

### 9.1 Testing

- [ ] Unit tests for schema parser
- [ ] Unit tests for each renderer
- [ ] Unit tests for validation logic
- [ ] Integration tests for complex schemas
- [ ] Visual regression tests
- [ ] Accessibility tests (axe-core)
- [ ] Test against JSON Schema Test Suite

### 9.2 Documentation

- [ ] API documentation
- [ ] Usage examples
- [ ] Theming guide
- [ ] Accessibility documentation
- [ ] Browser support matrix

---

## Phase 10: Build & Distribution

### 10.1 Build Configuration

- [x] Production build with minification (Vite)
- [x] Source maps
- [x] TypeScript declarations (.d.ts)
- [x] ES modules bundle
- [x] Tree-shaking support

### 10.2 Package Distribution

- [x] npm package configuration
- [ ] CDN distribution setup
- [ ] Changelog maintenance
- [x] Semantic versioning

---

## Implementation Priority

### MVP (Minimum Viable Product)

1. Phase 1: Project Setup
2. Phase 2: Core Type Renderers (all)
3. Phase 3.1: Annotation Keywords
4. Phase 3.2: Basic Validation Keywords
5. Phase 3.3: Enum & Const
6. Phase 5.1: Basic $ref and $defs support

### Second Release

1. Phase 4: Composition & Conditional Keywords
2. Phase 6.2: Format Validation & UI
3. Phase 7: UX Enhancements
4. Phase 8: Full API & Events

### Future Releases

1. Phase 5.2: Advanced Reference Resolution
2. Phase 6.1: Unevaluated Keywords
3. Phase 6.3: Content Keywords

---

## Technical Considerations

### Schema Parsing Strategy

1. Parse JSON string to object
2. Resolve all `$ref` references (build reference map)
3. Normalize schema (handle boolean schemas, defaults)
4. Build render tree based on schema structure

### Rendering Strategy

1. Use recursive component pattern
2. Each type has dedicated renderer component
3. Renderers are Lit components that can nest
4. Use context/events for form state communication

### Validation Strategy

1. Client-side validation using schema rules
2. Validate on blur and on submit
3. Option for validate-on-change
4. Consider using existing library (Ajv) for complex validation

### Performance Considerations

- Lazy render collapsed sections
- Debounce validation for large forms
- Virtual scrolling for large arrays
- Memoize schema parsing results
