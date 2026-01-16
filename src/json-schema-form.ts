import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { JSONSchema, ValidationError } from "./schema/types.js";
import { SchemaParser } from "./schema/parser.js";
import { SchemaValidator } from "./schema/validator.js";
import { formStyles } from "./styles/form-styles.js";

/**
 * JSON Schema Form Web Component
 *
 * A web component that generates HTML forms from JSON Schema documents.
 *
 * @element json-schema-form
 *
 * @fires json-schema-form-submit - Fired when the form is submitted with valid data
 * @fires json-schema-form-change - Fired when any form value changes
 * @fires json-schema-form-error - Fired when validation errors occur
 * @fires json-schema-form-ready - Fired when the schema is parsed and form is ready
 *
 * @csspart form - The form element
 * @csspart field - Individual field containers
 * @csspart label - Field labels
 * @csspart input - Input elements
 * @csspart error - Error messages
 * @csspart actions - Form action buttons container
 *
 * @cssprop [--jsf-color-primary=#6366f1] - Primary accent color
 * @cssprop [--jsf-color-error=#ef4444] - Error color
 * @cssprop [--jsf-font-family=system-ui] - Font family
 */
@customElement("json-schema-form")
export class JsonSchemaForm extends LitElement {
  static override styles = [
    formStyles,
    css`
      :host {
        display: block;
      }

      .jsf-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--jsf-spacing-xl);
        color: var(--jsf-color-text-muted);
      }

      .jsf-error-container {
        padding: var(--jsf-spacing-lg);
        background-color: var(--jsf-color-error-bg);
        border: 1px solid var(--jsf-color-error);
        border-radius: var(--jsf-radius-md);
        color: var(--jsf-color-error);
      }
    `,
  ];

  /**
   * The JSON Schema as a string
   */
  @property({ type: String })
  schema = "";

  /**
   * The current form value
   */
  @property({ type: Object, attribute: false })
  value: unknown = undefined;

  /**
   * Whether to validate on every change
   */
  @property({ type: Boolean, attribute: "validate-on-change" })
  validateOnChange = false;

  /**
   * Whether to show the submit button
   */
  @property({ type: Boolean, attribute: "show-submit" })
  showSubmit = true;

  /**
   * Submit button text
   */
  @property({ type: String, attribute: "submit-text" })
  submitText = "Submit";

  /**
   * Initial data as a JSON string to populate the form
   */
  @property({ type: String, attribute: "initial-data" })
  initialData = "";

  /**
   * Parsed schema object
   */
  @state()
  private _parsedSchema: JSONSchema | null = null;

  /**
   * Schema parsing error
   */
  @state()
  private _parseError: string | null = null;

  /**
   * Current validation errors
   */
  @state()
  private _errors: ValidationError[] = [];

  /**
   * Whether the form has been submitted at least once
   */
  @state()
  private _submitted = false;

  /**
   * Track selected schema indices for anyOf/oneOf at each path
   */
  @state()
  private _schemaSelections: Map<string, number> = new Map();

  /**
   * Track collapsed state for collapsible sections
   */
  @state()
  private _collapsedSections: Set<string> = new Set();

  /**
   * Parsed initial data object
   */
  private _parsedInitialData: unknown = undefined;

  /**
   * Initial data parsing error
   */
  @state()
  private _initialDataError: string | null = null;

  /**
   * Schema parser instance
   */
  private _parser: SchemaParser | null = null;

  /**
   * Schema validator instance
   */
  private _validator: SchemaValidator | null = null;

  /**
   * Get whether the form is currently valid
   */
  get valid(): boolean {
    return this._errors.length === 0;
  }

  /**
   * Get current validation errors
   */
  get errors(): ValidationError[] {
    return [...this._errors];
  }

  /**
   * Get the parsed schema
   */
  getSchema(): JSONSchema | null {
    return this._parsedSchema;
  }

  /**
   * Get the parsed initial data
   */
  getInitialData(): unknown {
    return this._parsedInitialData;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._parseSchema();
  }

  override updated(changedProperties: PropertyValues): void {
    if (changedProperties.has("schema")) {
      this._parseSchema();
    } else if (changedProperties.has("initialData")) {
      // When initialData changes (but not schema), update the value
      this._parseInitialData();
      if (this._parsedInitialData !== undefined) {
        this.value = JSON.parse(JSON.stringify(this._parsedInitialData));
      }
    }

    if (changedProperties.has("value") && this.validateOnChange) {
      this._validate();
    }
  }

  /**
   * Parse the schema string
   */
  private _parseSchema(): void {
    if (!this.schema) {
      this._parsedSchema = null;
      this._parseError = null;
      return;
    }

    try {
      this._parsedSchema = SchemaParser.parse(this.schema);
      this._parser = new SchemaParser(this._parsedSchema);
      this._validator = new SchemaValidator(this._parsedSchema);
      this._parseError = null;

      // Parse initial data if provided
      this._parseInitialData();

      // Initialize value: use initial data if provided, otherwise defaults
      if (this.value === undefined) {
        if (this._parsedInitialData !== undefined) {
          // Deep clone to prevent mutations to the original initial data
          this.value = JSON.parse(JSON.stringify(this._parsedInitialData));
        } else {
          this.value = this._getDefaultValue(this._parsedSchema);
        }
      }

      this._dispatchEvent("json-schema-form-ready", {
        schema: this._parsedSchema,
      });
    } catch (e) {
      this._parseError =
        e instanceof Error ? e.message : "Failed to parse schema";
      this._parsedSchema = null;
      this._parser = null;
      this._validator = null;
    }
  }

  /**
   * Parse the initial data string
   */
  private _parseInitialData(): void {
    if (!this.initialData) {
      this._parsedInitialData = undefined;
      this._initialDataError = null;
      return;
    }

    try {
      this._parsedInitialData = JSON.parse(this.initialData);
      this._initialDataError = null;
    } catch (e) {
      this._initialDataError =
        e instanceof Error ? e.message : "Failed to parse initial data";
      this._parsedInitialData = undefined;
    }
  }

  /**
   * Get the default value for a schema
   */
  private _getDefaultValue(schema: JSONSchema): unknown {
    // Use explicit default if provided
    if (schema.default !== undefined) {
      return schema.default;
    }

    // Use const if provided
    if (schema.const !== undefined) {
      return schema.const;
    }

    // Handle oneOf/anyOf - generate default based on first subschema
    if (schema.oneOf && schema.oneOf.length > 0) {
      const firstSchema = schema.oneOf[0];
      if (typeof firstSchema !== "boolean") {
        return this._getDefaultValue(firstSchema);
      }
    }

    if (schema.anyOf && schema.anyOf.length > 0) {
      const firstSchema = schema.anyOf[0];
      if (typeof firstSchema !== "boolean") {
        return this._getDefaultValue(firstSchema);
      }
    }

    // Generate default based on type
    const types = SchemaParser.getTypes(schema);
    const primaryType = types[0] || this._inferTypeFromSchema(schema);

    switch (primaryType) {
      case "object":
        return this._getDefaultObjectValue(schema);
      case "array":
        return [];
      case "string":
        return "";
      case "number":
      case "integer":
        return schema.minimum ?? 0;
      case "boolean":
        return false;
      case "null":
        return null;
      default:
        return undefined;
    }
  }

  /**
   * Infer type from schema keywords (without looking at value)
   */
  private _inferTypeFromSchema(schema: JSONSchema): string | undefined {
    if (schema.properties || schema.additionalProperties || schema.required) {
      return "object";
    }
    if (schema.items || schema.prefixItems) {
      return "array";
    }
    if (schema.enum && schema.enum.length > 0) {
      // Infer from first enum value
      const firstVal = schema.enum[0];
      if (firstVal === null) return "null";
      if (Array.isArray(firstVal)) return "array";
      return typeof firstVal;
    }
    return undefined;
  }

  /**
   * Get default value for an object schema
   */
  private _getDefaultObjectValue(schema: JSONSchema): Record<string, unknown> {
    const obj: Record<string, unknown> = {};

    if (schema.properties) {
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        if (typeof propSchema === "boolean") {
          continue;
        }
        // Only set defaults for required properties or those with explicit defaults
        if (
          schema.required?.includes(key) ||
          propSchema.default !== undefined
        ) {
          obj[key] = this._getDefaultValue(propSchema);
        }
      }
    }

    return obj;
  }

  /**
   * Validate the current value
   */
  validate(): boolean {
    this._submitted = true;
    return this._validate();
  }

  /**
   * Internal validation
   */
  private _validate(): boolean {
    if (!this._validator || !this._parsedSchema) {
      return true;
    }

    this._errors = this._validator.validate(this.value);

    if (this._errors.length > 0) {
      this._dispatchEvent("json-schema-form-error", { errors: this._errors });
    }

    return this._errors.length === 0;
  }

  /**
   * Reset the form to initial data or default values
   */
  reset(): void {
    if (this._parsedInitialData !== undefined) {
      // Reset to initial data if provided
      this.value = JSON.parse(JSON.stringify(this._parsedInitialData));
    } else if (this._parsedSchema) {
      this.value = this._getDefaultValue(this._parsedSchema);
    } else {
      this.value = undefined;
    }
    this._errors = [];
    this._submitted = false;
  }

  /**
   * Programmatically submit the form
   */
  submit(): void {
    this._handleSubmit(new Event("submit"));
  }

  /**
   * Handle form submission
   */
  private _handleSubmit(e: Event): void {
    e.preventDefault();

    if (this.validate()) {
      this._dispatchEvent("json-schema-form-submit", { value: this.value });
    }
  }

  /**
   * Handle value changes from field renderers
   */
  private _handleValueChange(path: string, newValue: unknown): void {
    // Update the value at the specified path
    if (path === "") {
      this.value = newValue;
    } else {
      // Clone and update nested value
      this.value = this._setNestedValue(this.value, path, newValue);
    }

    this._dispatchEvent("json-schema-form-change", {
      value: this.value,
      path,
      changedValue: newValue,
    });

    if (this.validateOnChange || this._submitted) {
      this._validate();
    }
  }

  /**
   * Set a nested value in an object
   */
  private _setNestedValue(obj: unknown, path: string, value: unknown): unknown {
    const parts = path.split("/").filter((p) => p !== "");

    if (parts.length === 0) {
      return value;
    }

    const clone = Array.isArray(obj) ? [...obj] : { ...(obj as object) };
    let current: Record<string, unknown> | unknown[] = clone as Record<
      string,
      unknown
    >;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const next = Array.isArray(current)
        ? current[parseInt(part, 10)]
        : (current as Record<string, unknown>)[part];

      const cloned = Array.isArray(next) ? [...next] : { ...(next as object) };

      if (Array.isArray(current)) {
        current[parseInt(part, 10)] = cloned;
      } else {
        (current as Record<string, unknown>)[part] = cloned;
      }

      current = cloned as Record<string, unknown>;
    }

    const lastPart = parts[parts.length - 1];
    if (Array.isArray(current)) {
      current[parseInt(lastPart, 10)] = value;
    } else {
      (current as Record<string, unknown>)[lastPart] = value;
    }

    return clone;
  }

  /**
   * Dispatch a custom event
   */
  private _dispatchEvent(name: string, detail: Record<string, unknown>): void {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Render the form
   */
  override render() {
    if (this._parseError) {
      return html`
        <div class="jsf-error-container" role="alert">
          <strong>Schema Error:</strong> ${this._parseError}
        </div>
      `;
    }

    if (this._initialDataError) {
      return html`
        <div class="jsf-error-container" role="alert">
          <strong>Initial Data Error:</strong> ${this._initialDataError}
        </div>
      `;
    }

    if (!this._parsedSchema) {
      return html` <div class="jsf-loading">No schema provided</div> `;
    }

    return html`
      <form
        class="jsf-form"
        part="form"
        @submit=${this._handleSubmit}
        novalidate
      >
        ${this._renderSchema(this._parsedSchema, "", this.value)}
        ${this.showSubmit
          ? html`
              <div class="jsf-actions" part="actions">
                <button
                  type="submit"
                  class="jsf-button jsf-button--primary"
                  ?disabled=${!this.valid && this._submitted}
                >
                  ${this.submitText}
                </button>
              </div>
            `
          : ""}
      </form>
    `;
  }

  /**
   * Render a schema at a given path
   */
  private _renderSchema(
    schema: JSONSchema | boolean,
    path: string,
    value: unknown
  ): unknown {
    // Handle boolean schemas
    if (typeof schema === "boolean") {
      return schema
        ? html``
        : html`<div class="jsf-error">This field is not allowed</div>`;
    }

    // Handle $ref
    if (schema.$ref && this._parser) {
      const resolved = this._parser.resolveRef(schema.$ref);
      if (resolved) {
        // Check for circular reference
        if ((resolved as { _isCircular?: boolean })._isCircular) {
          return html`
            <div class="jsf-circular-ref">
              <svg
                class="jsf-circular-ref-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Circular reference: ${schema.$ref}</span>
            </div>
          `;
        }
        return this._renderSchema(resolved, path, value);
      }
      return html`<div class="jsf-error">
        Unable to resolve reference: ${schema.$ref}
      </div>`;
    }

    // Handle anyOf - render a selector if multiple options
    if (schema.anyOf && schema.anyOf.length > 0) {
      return this._renderAnyOfOneOf(schema, schema.anyOf, "anyOf", path, value);
    }

    // Handle oneOf - render a selector if multiple options
    if (schema.oneOf && schema.oneOf.length > 0) {
      return this._renderAnyOfOneOf(schema, schema.oneOf, "oneOf", path, value);
    }

    // Handle if/then/else conditional schemas
    if (schema.if !== undefined) {
      return this._renderConditional(schema, path, value);
    }

    // Determine type and render appropriate field
    const types = SchemaParser.getTypes(schema);
    const primaryType = types[0] || this._inferType(schema, value);

    // Get errors for this path
    const fieldErrors = this._errors.filter((e) => e.instancePath === path);

    // Get field label (title or derived from field name)
    const fieldLabel = this._getFieldLabel(schema, path);

    return html`
      <div
        class="jsf-field ${schema.deprecated
          ? "jsf-deprecated"
          : ""} ${schema.readOnly ? "jsf-readonly" : ""}"
        part="field"
      >
        ${fieldLabel
          ? html`
              <label
                class="jsf-label ${schema.required?.length
                  ? "jsf-label-required"
                  : ""}"
                part="label"
              >
                ${fieldLabel}
              </label>
            `
          : ""}
        ${this._renderFieldByType(primaryType, schema, path, value)}
        ${schema.description
          ? html` <p class="jsf-description">${schema.description}</p> `
          : ""}
        ${fieldErrors.map(
          (error) => html`
            <div class="jsf-error" part="error" role="alert">
              <svg
                class="jsf-error-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              ${error.message}
            </div>
          `
        )}
      </div>
    `;
  }

  /**
   * Infer type from schema keywords or value
   */
  private _inferType(schema: JSONSchema, value: unknown): string {
    if (schema.properties || schema.additionalProperties || schema.required) {
      return "object";
    }
    if (schema.items || schema.prefixItems) {
      return "array";
    }
    if (schema.enum) {
      return "string"; // Default enum to string
    }

    // Infer from value
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value;
  }

  /**
   * Render a field based on its type
   */
  private _renderFieldByType(
    type: string,
    schema: JSONSchema,
    path: string,
    value: unknown
  ): unknown {
    // Handle enum as select
    if (schema.enum) {
      return this._renderEnum(schema, path, value);
    }

    // Handle const as readonly
    if (schema.const !== undefined) {
      return this._renderConst(schema);
    }

    switch (type) {
      case "string":
        return this._renderString(schema, path, value as string);
      case "number":
      case "integer":
        return this._renderNumber(
          schema,
          path,
          value as number,
          type === "integer"
        );
      case "boolean":
        return this._renderBoolean(schema, path, value as boolean);
      case "object":
        return this._renderObject(
          schema,
          path,
          value as Record<string, unknown>
        );
      case "array":
        return this._renderArray(schema, path, value as unknown[]);
      case "null":
        return this._renderNull();
      default:
        return html`<div class="jsf-error">Unsupported type: ${type}</div>`;
    }
  }

  /**
   * Render a string field
   */
  private _renderString(
    schema: JSONSchema,
    path: string,
    value: string
  ): unknown {
    const hasError = this._errors.some((e) => e.instancePath === path);
    const formatError = this._errors.find(
      (e) => e.instancePath === path && e.keyword === "format"
    );

    // Use textarea for long strings
    if (schema.maxLength && schema.maxLength > 100) {
      return html`
        <textarea
          class="jsf-input jsf-textarea ${hasError ? "jsf-input--error" : ""}"
          part="input"
          .value=${value ?? ""}
          ?disabled=${schema.readOnly}
          ?required=${this._isRequired(path)}
          placeholder=${schema.examples?.[0] ?? ""}
          minlength=${schema.minLength ?? ""}
          maxlength=${schema.maxLength ?? ""}
          @input=${(e: Event) =>
            this._handleValueChange(
              path,
              (e.target as HTMLTextAreaElement).value
            )}
        ></textarea>
      `;
    }

    // Render format-specific inputs
    if (schema.format) {
      return this._renderFormatInput(
        schema,
        path,
        value,
        hasError,
        formatError?.message
      );
    }

    return html`
      <input
        type="text"
        class="jsf-input ${hasError ? "jsf-input--error" : ""}"
        part="input"
        .value=${value ?? ""}
        ?disabled=${schema.readOnly}
        ?required=${this._isRequired(path)}
        placeholder=${schema.examples?.[0] ?? ""}
        minlength=${schema.minLength ?? ""}
        maxlength=${schema.maxLength ?? ""}
        pattern=${schema.pattern ?? ""}
        @input=${(e: Event) =>
          this._handleValueChange(path, (e.target as HTMLInputElement).value)}
      />
    `;
  }

  /**
   * Render format-specific input components
   */
  private _renderFormatInput(
    schema: JSONSchema,
    path: string,
    value: string,
    hasError: boolean,
    formatErrorMessage?: string
  ): unknown {
    const format = schema.format;
    const examplePlaceholder = schema.examples?.[0];
    const placeholder =
      typeof examplePlaceholder === "string"
        ? examplePlaceholder
        : this._getFormatPlaceholder(format);

    switch (format) {
      case "date":
        return this._renderDateInput(schema, path, value, hasError);

      case "time":
        return this._renderTimeInput(schema, path, value, hasError);

      case "date-time":
        return this._renderDateTimeInput(schema, path, value, hasError);

      case "email":
        return this._renderEmailInput(
          schema,
          path,
          value,
          hasError,
          placeholder
        );

      case "uri":
      case "uri-reference":
      case "iri":
      case "iri-reference":
        return this._renderUriInput(
          schema,
          path,
          value,
          hasError,
          placeholder,
          format
        );

      case "uuid":
        return this._renderUuidInput(schema, path, value, hasError);

      case "ipv4":
        return this._renderIpv4Input(schema, path, value, hasError);

      case "ipv6":
        return this._renderIpv6Input(schema, path, value, hasError);

      case "hostname":
      case "idn-hostname":
        return this._renderHostnameInput(
          schema,
          path,
          value,
          hasError,
          placeholder
        );

      case "duration":
        return this._renderDurationInput(schema, path, value, hasError);

      case "regex":
        return this._renderRegexInput(schema, path, value, hasError);

      case "json-pointer":
      case "relative-json-pointer":
        return this._renderJsonPointerInput(
          schema,
          path,
          value,
          hasError,
          format
        );

      default:
        // Unknown format - render as text
        return html`
          <input
            type="text"
            class="jsf-input ${hasError ? "jsf-input--error" : ""}"
            part="input"
            .value=${value ?? ""}
            ?disabled=${schema.readOnly}
            ?required=${this._isRequired(path)}
            placeholder=${placeholder}
            @input=${(e: Event) =>
              this._handleValueChange(
                path,
                (e.target as HTMLInputElement).value
              )}
          />
        `;
    }
  }

  /**
   * Get placeholder text for a format
   */
  private _getFormatPlaceholder(format?: string): string {
    switch (format) {
      case "date":
        return "YYYY-MM-DD";
      case "time":
        return "HH:MM:SS";
      case "date-time":
        return "YYYY-MM-DDTHH:MM:SS";
      case "email":
        return "user@example.com";
      case "uri":
      case "iri":
        return "https://example.com";
      case "uri-reference":
      case "iri-reference":
        return "/path/to/resource";
      case "uuid":
        return "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
      case "ipv4":
        return "192.168.1.1";
      case "ipv6":
        return "2001:0db8:85a3::8a2e:0370:7334";
      case "hostname":
      case "idn-hostname":
        return "example.com";
      case "duration":
        return "P1Y2M3DT4H5M6S";
      case "regex":
        return "^[a-z]+$";
      case "json-pointer":
        return "/path/to/value";
      case "relative-json-pointer":
        return "1/path";
      default:
        return "";
    }
  }

  /**
   * Render date input with picker
   */
  private _renderDateInput(
    schema: JSONSchema,
    path: string,
    value: string,
    hasError: boolean
  ): unknown {
    return html`
      <div class="jsf-format-input jsf-format-date">
        <input
          type="date"
          class="jsf-input ${hasError ? "jsf-input--error" : ""}"
          part="input"
          .value=${value ?? ""}
          ?disabled=${schema.readOnly}
          ?required=${this._isRequired(path)}
          @input=${(e: Event) =>
            this._handleValueChange(path, (e.target as HTMLInputElement).value)}
        />
        <span class="jsf-format-icon">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </div>
    `;
  }

  /**
   * Render time input with picker
   */
  private _renderTimeInput(
    schema: JSONSchema,
    path: string,
    value: string,
    hasError: boolean
  ): unknown {
    // Convert full time format to HTML time input format (HH:MM)
    const htmlValue = value ? value.substring(0, 5) : "";

    return html`
      <div class="jsf-format-input jsf-format-time">
        <input
          type="time"
          class="jsf-input ${hasError ? "jsf-input--error" : ""}"
          part="input"
          .value=${htmlValue}
          ?disabled=${schema.readOnly}
          ?required=${this._isRequired(path)}
          step="1"
          @input=${(e: Event) => {
            const inputValue = (e.target as HTMLInputElement).value;
            // Convert to full time format with seconds
            const fullTime = inputValue ? `${inputValue}:00` : "";
            this._handleValueChange(path, fullTime);
          }}
        />
        <span class="jsf-format-icon">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </div>
    `;
  }

  /**
   * Render date-time input with picker
   */
  private _renderDateTimeInput(
    schema: JSONSchema,
    path: string,
    value: string,
    hasError: boolean
  ): unknown {
    // Convert ISO format to datetime-local format
    const htmlValue = value
      ? value
          .replace("Z", "")
          .replace(/[+-]\d{2}:\d{2}$/, "")
          .substring(0, 16)
      : "";

    return html`
      <div class="jsf-format-input jsf-format-datetime">
        <input
          type="datetime-local"
          class="jsf-input ${hasError ? "jsf-input--error" : ""}"
          part="input"
          .value=${htmlValue}
          ?disabled=${schema.readOnly}
          ?required=${this._isRequired(path)}
          @input=${(e: Event) => {
            const inputValue = (e.target as HTMLInputElement).value;
            // Convert to ISO format
            const isoValue = inputValue ? `${inputValue}:00` : "";
            this._handleValueChange(path, isoValue);
          }}
        />
        <span class="jsf-format-icon">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </div>
    `;
  }

  /**
   * Render email input with icon
   */
  private _renderEmailInput(
    schema: JSONSchema,
    path: string,
    value: string,
    hasError: boolean,
    placeholder: string
  ): unknown {
    return html`
      <div class="jsf-format-input jsf-format-email">
        <span class="jsf-format-icon jsf-format-icon--left">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path
              d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
            />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        </span>
        <input
          type="email"
          class="jsf-input jsf-input--with-icon ${hasError
            ? "jsf-input--error"
            : ""}"
          part="input"
          .value=${value ?? ""}
          ?disabled=${schema.readOnly}
          ?required=${this._isRequired(path)}
          placeholder=${placeholder}
          @input=${(e: Event) =>
            this._handleValueChange(path, (e.target as HTMLInputElement).value)}
        />
      </div>
    `;
  }

  /**
   * Render URI input with icon
   */
  private _renderUriInput(
    schema: JSONSchema,
    path: string,
    value: string,
    hasError: boolean,
    placeholder: string,
    format: string
  ): unknown {
    return html`
      <div class="jsf-format-input jsf-format-uri">
        <span class="jsf-format-icon jsf-format-icon--left">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path
              fill-rule="evenodd"
              d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <input
          type="url"
          class="jsf-input jsf-input--with-icon ${hasError
            ? "jsf-input--error"
            : ""}"
          part="input"
          .value=${value ?? ""}
          ?disabled=${schema.readOnly}
          ?required=${this._isRequired(path)}
          placeholder=${placeholder}
          @input=${(e: Event) =>
            this._handleValueChange(path, (e.target as HTMLInputElement).value)}
        />
        ${value && !hasError
          ? html`
              <a
                href=${value}
                target="_blank"
                rel="noopener noreferrer"
                class="jsf-format-action"
                title="Open link"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="14"
                  height="14"
                >
                  <path
                    d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
                  />
                  <path
                    d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"
                  />
                </svg>
              </a>
            `
          : ""}
      </div>
    `;
  }

  /**
   * Render UUID input with generate button
   */
  private _renderUuidInput(
    schema: JSONSchema,
    path: string,
    value: string,
    hasError: boolean
  ): unknown {
    return html`
      <div class="jsf-format-input jsf-format-uuid">
        <input
          type="text"
          class="jsf-input jsf-input--monospace ${hasError
            ? "jsf-input--error"
            : ""}"
          part="input"
          .value=${value ?? ""}
          ?disabled=${schema.readOnly}
          ?required=${this._isRequired(path)}
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          pattern="^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"
          @input=${(e: Event) =>
            this._handleValueChange(
              path,
              (e.target as HTMLInputElement).value.toLowerCase()
            )}
        />
        ${!schema.readOnly
          ? html`
              <button
                type="button"
                class="jsf-format-action jsf-format-action--button"
                title="Generate UUID"
                @click=${() =>
                  this._handleValueChange(path, this._generateUuid())}
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="14"
                  height="14"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            `
          : ""}
      </div>
    `;
  }

  /**
   * Generate a random UUID v4
   */
  private _generateUuid(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Render IPv4 input with segmented display
   */
  private _renderIpv4Input(
    schema: JSONSchema,
    path: string,
    value: string,
    hasError: boolean
  ): unknown {
    return html`
      <div class="jsf-format-input jsf-format-ip">
        <span class="jsf-format-icon jsf-format-icon--left">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path
              fill-rule="evenodd"
              d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <input
          type="text"
          class="jsf-input jsf-input--with-icon jsf-input--monospace ${hasError
            ? "jsf-input--error"
            : ""}"
          part="input"
          .value=${value ?? ""}
          ?disabled=${schema.readOnly}
          ?required=${this._isRequired(path)}
          placeholder="192.168.1.1"
          pattern="^(\\d{1,3}\\.){3}\\d{1,3}$"
          @input=${(e: Event) =>
            this._handleValueChange(path, (e.target as HTMLInputElement).value)}
        />
      </div>
    `;
  }

  /**
   * Render IPv6 input
   */
  private _renderIpv6Input(
    schema: JSONSchema,
    path: string,
    value: string,
    hasError: boolean
  ): unknown {
    return html`
      <div class="jsf-format-input jsf-format-ip">
        <span class="jsf-format-icon jsf-format-icon--left">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path
              fill-rule="evenodd"
              d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <input
          type="text"
          class="jsf-input jsf-input--with-icon jsf-input--monospace ${hasError
            ? "jsf-input--error"
            : ""}"
          part="input"
          .value=${value ?? ""}
          ?disabled=${schema.readOnly}
          ?required=${this._isRequired(path)}
          placeholder="2001:0db8:85a3::8a2e:0370:7334"
          @input=${(e: Event) =>
            this._handleValueChange(
              path,
              (e.target as HTMLInputElement).value.toLowerCase()
            )}
        />
      </div>
    `;
  }

  /**
   * Render hostname input
   */
  private _renderHostnameInput(
    schema: JSONSchema,
    path: string,
    value: string,
    hasError: boolean,
    placeholder: string
  ): unknown {
    return html`
      <div class="jsf-format-input jsf-format-hostname">
        <span class="jsf-format-icon jsf-format-icon--left">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path
              fill-rule="evenodd"
              d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <input
          type="text"
          class="jsf-input jsf-input--with-icon ${hasError
            ? "jsf-input--error"
            : ""}"
          part="input"
          .value=${value ?? ""}
          ?disabled=${schema.readOnly}
          ?required=${this._isRequired(path)}
          placeholder=${placeholder}
          @input=${(e: Event) =>
            this._handleValueChange(
              path,
              (e.target as HTMLInputElement).value.toLowerCase()
            )}
        />
      </div>
    `;
  }

  /**
   * Render duration input with helper
   */
  private _renderDurationInput(
    schema: JSONSchema,
    path: string,
    value: string,
    hasError: boolean
  ): unknown {
    return html`
      <div class="jsf-format-input jsf-format-duration">
        <input
          type="text"
          class="jsf-input jsf-input--monospace ${hasError
            ? "jsf-input--error"
            : ""}"
          part="input"
          .value=${value ?? ""}
          ?disabled=${schema.readOnly}
          ?required=${this._isRequired(path)}
          placeholder="P1Y2M3DT4H5M6S"
          @input=${(e: Event) =>
            this._handleValueChange(
              path,
              (e.target as HTMLInputElement).value.toUpperCase()
            )}
        />
        <span class="jsf-format-hint">
          ISO 8601: P[years]Y[months]M[days]DT[hours]H[minutes]M[seconds]S
        </span>
      </div>
    `;
  }

  /**
   * Render regex input with test functionality
   */
  private _renderRegexInput(
    schema: JSONSchema,
    path: string,
    value: string,
    hasError: boolean
  ): unknown {
    return html`
      <div class="jsf-format-input jsf-format-regex">
        <span
          class="jsf-format-icon jsf-format-icon--left jsf-format-icon--regex"
          >/</span
        >
        <input
          type="text"
          class="jsf-input jsf-input--with-icon jsf-input--monospace ${hasError
            ? "jsf-input--error"
            : ""}"
          part="input"
          .value=${value ?? ""}
          ?disabled=${schema.readOnly}
          ?required=${this._isRequired(path)}
          placeholder="^[a-z]+$"
          @input=${(e: Event) =>
            this._handleValueChange(path, (e.target as HTMLInputElement).value)}
        />
        <span class="jsf-format-icon jsf-format-icon--regex">/</span>
      </div>
    `;
  }

  /**
   * Render JSON Pointer input
   */
  private _renderJsonPointerInput(
    schema: JSONSchema,
    path: string,
    value: string,
    hasError: boolean,
    format: string
  ): unknown {
    const placeholder =
      format === "relative-json-pointer" ? "1/path/to/value" : "/path/to/value";

    return html`
      <div class="jsf-format-input jsf-format-json-pointer">
        <span class="jsf-format-icon jsf-format-icon--left">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path
              fill-rule="evenodd"
              d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <input
          type="text"
          class="jsf-input jsf-input--with-icon jsf-input--monospace ${hasError
            ? "jsf-input--error"
            : ""}"
          part="input"
          .value=${value ?? ""}
          ?disabled=${schema.readOnly}
          ?required=${this._isRequired(path)}
          placeholder=${placeholder}
          @input=${(e: Event) =>
            this._handleValueChange(path, (e.target as HTMLInputElement).value)}
        />
      </div>
    `;
  }

  /**
   * Render a number field
   */
  private _renderNumber(
    schema: JSONSchema,
    path: string,
    value: number,
    isInteger: boolean
  ): unknown {
    const hasError = this._errors.some((e) => e.instancePath === path);

    return html`
      <input
        type="number"
        class="jsf-input ${hasError ? "jsf-input--error" : ""}"
        part="input"
        .value=${value?.toString() ?? ""}
        ?disabled=${schema.readOnly}
        ?required=${this._isRequired(path)}
        min=${schema.minimum ?? schema.exclusiveMinimum ?? ""}
        max=${schema.maximum ?? schema.exclusiveMaximum ?? ""}
        step=${isInteger ? "1" : schema.multipleOf ?? "any"}
        @input=${(e: Event) => {
          const val = (e.target as HTMLInputElement).value;
          const num = isInteger ? parseInt(val, 10) : parseFloat(val);
          this._handleValueChange(path, isNaN(num) ? undefined : num);
        }}
      />
    `;
  }

  /**
   * Render a boolean field
   */
  private _renderBoolean(
    schema: JSONSchema,
    path: string,
    value: boolean
  ): unknown {
    return html`
      <div class="jsf-checkbox-wrapper">
        <input
          type="checkbox"
          class="jsf-checkbox"
          part="input"
          .checked=${value ?? false}
          ?disabled=${schema.readOnly}
          @change=${(e: Event) =>
            this._handleValueChange(
              path,
              (e.target as HTMLInputElement).checked
            )}
        />
        ${!schema.title && schema.description
          ? html`
              <span class="jsf-checkbox-label">${schema.description}</span>
            `
          : ""}
      </div>
    `;
  }

  /**
   * Render an enum field
   */
  private _renderEnum(
    schema: JSONSchema,
    path: string,
    value: unknown
  ): unknown {
    const hasError = this._errors.some((e) => e.instancePath === path);

    return html`
      <select
        class="jsf-input jsf-select ${hasError ? "jsf-input--error" : ""}"
        part="input"
        ?disabled=${schema.readOnly}
        ?required=${this._isRequired(path)}
        @change=${(e: Event) => {
          const selected = (e.target as HTMLSelectElement).value;
          // Try to preserve the original type
          const enumValue = schema.enum?.find((v) => String(v) === selected);
          this._handleValueChange(path, enumValue);
        }}
      >
        <option value="" ?selected=${value === undefined}>Select...</option>
        ${schema.enum?.map(
          (option) => html`
            <option value=${String(option)} ?selected=${value === option}>
              ${String(option)}
            </option>
          `
        )}
      </select>
    `;
  }

  /**
   * Render a const field (readonly display)
   */
  private _renderConst(schema: JSONSchema): unknown {
    return html`
      <input
        type="text"
        class="jsf-input"
        part="input"
        .value=${String(schema.const)}
        disabled
        readonly
      />
    `;
  }

  /**
   * Render a null field
   */
  private _renderNull(): unknown {
    return html`
      <input
        type="text"
        class="jsf-input"
        part="input"
        value="null"
        disabled
        readonly
      />
    `;
  }

  /**
   * Render an object field
   */
  private _renderObject(
    schema: JSONSchema,
    path: string,
    value: Record<string, unknown>
  ): unknown {
    const currentValue = value || {};

    // Collect all properties to render (including from dependentSchemas)
    const effectiveSchema = this._getEffectiveObjectSchema(
      schema,
      currentValue
    );
    const properties = effectiveSchema.properties || {};

    // Identify additional properties (properties in value not defined in schema)
    const definedProps = new Set(Object.keys(properties));
    const additionalProps = Object.keys(currentValue).filter(
      (key) => !definedProps.has(key)
    );

    // Check if we can add additional properties
    const canAddProps = this._canAddProperty(
      schema,
      Object.keys(currentValue).length
    );

    // Get propertyNames schema for validation hints
    const propertyNamesSchema = schema.propertyNames;

    // Check if this should be collapsible (nested objects with titles)
    const isNested = path !== "";
    const hasTitle = Boolean(schema.title);
    const shouldCollapse = isNested && hasTitle;

    const objectContent = html`
      <div class="jsf-object ${shouldCollapse ? "jsf-object--nested" : ""}">
        ${Object.entries(properties).map(([propName, propSchema]) => {
          if (typeof propSchema === "boolean") {
            return propSchema ? html`` : html``;
          }

          const propPath = path ? `${path}/${propName}` : propName;
          const propValue = currentValue[propName];

          // Check if this property is a nested object that should be collapsible
          const propTypes = SchemaParser.getTypes(propSchema);
          const isNestedObject =
            propTypes.includes("object") && propSchema.properties;

          // Add required indicator to schema for rendering
          const schemaWithRequired = {
            ...propSchema,
            _isRequired: effectiveSchema.required?.includes(propName),
          };

          // Render nested objects with collapsible wrapper
          if (isNestedObject && propSchema.title) {
            const nestedContent = this._renderSchema(
              { ...schemaWithRequired, title: undefined },
              propPath,
              propValue
            );
            return this._renderCollapsible(
              propPath,
              propSchema.title,
              nestedContent,
              this._getObjectSummary(propValue as Record<string, unknown>)
            );
          }

          return this._renderSchema(schemaWithRequired, propPath, propValue);
        })}
        ${additionalProps.map((propName) => {
          const propPath = path ? `${path}/${propName}` : propName;
          const propValue = currentValue[propName];

          // Get schema for this property (check patternProperties first)
          const propSchema = this._getSchemaForProperty(
            schema,
            propName,
            propValue
          );
          const matchedPattern = this._getMatchingPattern(schema, propName);

          return html`
            <div
              class="jsf-additional-property ${matchedPattern
                ? "jsf-pattern-property"
                : ""}"
            >
              <div class="jsf-additional-property-header">
                <span class="jsf-additional-property-name">
                  ${propName}
                  ${matchedPattern
                    ? html`<span
                        class="jsf-pattern-badge"
                        title="Matches pattern: ${matchedPattern}"
                        >⚡</span
                      >`
                    : ""}
                </span>
                <button
                  type="button"
                  class="jsf-icon-button jsf-icon-button--danger"
                  title="Remove property"
                  @click=${() => this._removeProperty(path, propName)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              ${this._renderSchema(propSchema, propPath, propValue)}
            </div>
          `;
        })}
        ${canAddProps
          ? html`
              <div class="jsf-add-property">
                <input
                  type="text"
                  id="${path}-add-prop-input"
                  class="jsf-input jsf-add-property-input"
                  placeholder=${this._getPropertyNamePlaceholder(
                    propertyNamesSchema
                  )}
                  pattern=${this._getPropertyNamePattern(propertyNamesSchema)}
                  @keydown=${(e: KeyboardEvent) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      const error = this._validatePropertyName(
                        schema,
                        input.value,
                        Object.keys(currentValue)
                      );
                      if (error) {
                        this._showPropertyNameError(input, error);
                      } else {
                        this._addProperty(path, schema, input.value);
                        input.value = "";
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  class="jsf-button jsf-button--secondary"
                  @click=${(e: Event) => {
                    const input = (e.target as HTMLElement)
                      .previousElementSibling as HTMLInputElement;
                    if (input.value) {
                      const error = this._validatePropertyName(
                        schema,
                        input.value,
                        Object.keys(currentValue)
                      );
                      if (error) {
                        this._showPropertyNameError(input, error);
                      } else {
                        this._addProperty(path, schema, input.value);
                        input.value = "";
                      }
                    }
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Add Property
                </button>
              </div>
            `
          : ""}
      </div>
    `;

    return objectContent;
  }

  /**
   * Check if we can add more properties to an object
   */
  private _canAddProperty(schema: JSONSchema, currentCount: number): boolean {
    // Check if additionalProperties is allowed
    if (schema.additionalProperties === false && !schema.patternProperties) {
      return false;
    }

    // Check maxProperties constraint
    if (
      schema.maxProperties !== undefined &&
      currentCount >= schema.maxProperties
    ) {
      return false;
    }

    return true;
  }

  /**
   * Get the schema for a property (checking patternProperties)
   */
  private _getSchemaForProperty(
    schema: JSONSchema,
    propName: string,
    propValue: unknown
  ): JSONSchema {
    // Check if it matches any patternProperties
    if (schema.patternProperties) {
      for (const [pattern, patternSchema] of Object.entries(
        schema.patternProperties
      )) {
        try {
          const regex = new RegExp(pattern, "u");
          if (regex.test(propName)) {
            if (typeof patternSchema === "boolean") {
              return patternSchema ? {} : { not: {} };
            }
            return patternSchema;
          }
        } catch {
          // Invalid regex, skip
        }
      }
    }

    // Fall back to additionalProperties schema
    if (typeof schema.additionalProperties === "object") {
      return schema.additionalProperties;
    }

    // Infer from value
    return this._inferSchemaFromValue(propValue);
  }

  /**
   * Get the matching pattern for a property name
   */
  private _getMatchingPattern(
    schema: JSONSchema,
    propName: string
  ): string | null {
    if (!schema.patternProperties) return null;

    for (const pattern of Object.keys(schema.patternProperties)) {
      try {
        const regex = new RegExp(pattern, "u");
        if (regex.test(propName)) {
          return pattern;
        }
      } catch {
        // Invalid regex, skip
      }
    }

    return null;
  }

  /**
   * Get placeholder text for property name input
   */
  private _getPropertyNamePlaceholder(
    propertyNamesSchema: JSONSchema | boolean | undefined
  ): string {
    if (!propertyNamesSchema || typeof propertyNamesSchema === "boolean") {
      return "New property name";
    }

    if (propertyNamesSchema.pattern) {
      return `Property name (pattern: ${propertyNamesSchema.pattern})`;
    }

    return "New property name";
  }

  /**
   * Get pattern attribute for property name input
   */
  private _getPropertyNamePattern(
    propertyNamesSchema: JSONSchema | boolean | undefined
  ): string {
    if (!propertyNamesSchema || typeof propertyNamesSchema === "boolean") {
      return "";
    }

    return propertyNamesSchema.pattern || "";
  }

  /**
   * Validate a property name against propertyNames schema
   */
  private _validatePropertyName(
    schema: JSONSchema,
    propName: string,
    existingProps: string[]
  ): string | null {
    const trimmed = propName.trim();

    if (!trimmed) {
      return "Property name cannot be empty";
    }

    if (existingProps.includes(trimmed)) {
      return "Property already exists";
    }

    // Check propertyNames schema
    if (schema.propertyNames && typeof schema.propertyNames !== "boolean") {
      const nameSchema = schema.propertyNames;

      if (nameSchema.pattern) {
        const regex = new RegExp(nameSchema.pattern, "u");
        if (!regex.test(trimmed)) {
          return `Property name must match pattern: ${nameSchema.pattern}`;
        }
      }

      if (nameSchema.minLength && trimmed.length < nameSchema.minLength) {
        return `Property name must be at least ${nameSchema.minLength} characters`;
      }

      if (nameSchema.maxLength && trimmed.length > nameSchema.maxLength) {
        return `Property name must be at most ${nameSchema.maxLength} characters`;
      }
    }

    return null;
  }

  /**
   * Show an error message for property name validation
   */
  private _showPropertyNameError(input: HTMLInputElement, error: string): void {
    // Add error styling
    input.classList.add("jsf-input--error");

    // Show native validation message
    input.setCustomValidity(error);
    input.reportValidity();

    // Remove error styling after a delay
    setTimeout(() => {
      input.classList.remove("jsf-input--error");
      input.setCustomValidity("");
    }, 3000);
  }

  /**
   * Toggle a collapsible section
   */
  private _toggleCollapsible(path: string): void {
    if (this._collapsedSections.has(path)) {
      this._collapsedSections.delete(path);
    } else {
      this._collapsedSections.add(path);
    }
    this._collapsedSections = new Set(this._collapsedSections);
  }

  /**
   * Check if a section is expanded
   */
  private _isExpanded(path: string): boolean {
    return !this._collapsedSections.has(path);
  }

  /**
   * Render a collapsible wrapper for nested content
   */
  private _renderCollapsible(
    path: string,
    title: string,
    content: unknown,
    summary?: string
  ): unknown {
    const isExpanded = this._isExpanded(path);

    return html`
      <div
        class="jsf-collapsible ${isExpanded ? "jsf-collapsible--expanded" : ""}"
      >
        <div
          class="jsf-collapsible-header"
          @click=${() => this._toggleCollapsible(path)}
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              this._toggleCollapsible(path);
            }
          }}
          tabindex="0"
          role="button"
          aria-expanded=${isExpanded}
        >
          <svg
            class="jsf-collapsible-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="jsf-collapsible-title">${title}</span>
          ${summary
            ? html`<span class="jsf-collapsible-summary">${summary}</span>`
            : ""}
        </div>
        <div class="jsf-collapsible-content">${content}</div>
      </div>
    `;
  }

  /**
   * Get a summary of an object value for collapsed display
   */
  private _getObjectSummary(value: Record<string, unknown>): string {
    const keys = Object.keys(value || {});
    if (keys.length === 0) return "Empty";
    if (keys.length <= 3) {
      return keys.join(", ");
    }
    return `${keys.slice(0, 3).join(", ")} +${keys.length - 3} more`;
  }

  /**
   * Infer a schema from a value (for additional properties)
   */
  private _inferSchemaFromValue(value: unknown): JSONSchema {
    if (value === null) return { type: "null" };
    if (Array.isArray(value)) return { type: "array" };

    const type = typeof value;
    if (type === "number" && Number.isInteger(value)) {
      return { type: "integer" };
    }
    if (type === "string" || type === "number" || type === "boolean") {
      return { type: type as "string" | "number" | "boolean" };
    }
    if (type === "object") {
      return { type: "object" };
    }

    return { type: "string" }; // Default to string
  }

  /**
   * Add a new property to an object
   */
  private _addProperty(
    path: string,
    schema: JSONSchema,
    propName: string
  ): void {
    if (!propName.trim()) return;

    const sanitizedName = propName.trim();
    const currentValue =
      ((path ? this._getNestedValue(this.value, path) : this.value) as Record<
        string,
        unknown
      >) || {};

    // Don't add if property already exists
    if (sanitizedName in currentValue) return;

    // Get the appropriate schema for this property name
    const propSchema = this._getSchemaForProperty(
      schema,
      sanitizedName,
      undefined
    );

    // Get default value based on the resolved schema
    const defaultValue = this._getDefaultValue(propSchema);

    const newValue = { ...currentValue, [sanitizedName]: defaultValue };
    this._handleValueChange(path, newValue);
  }

  /**
   * Remove a property from an object
   */
  private _removeProperty(path: string, propName: string): void {
    const currentValue =
      ((path ? this._getNestedValue(this.value, path) : this.value) as Record<
        string,
        unknown
      >) || {};

    const { [propName]: _, ...rest } = currentValue;
    this._handleValueChange(path, rest);
  }

  /**
   * Get effective object schema after applying dependentSchemas
   */
  private _getEffectiveObjectSchema(
    schema: JSONSchema,
    value: Record<string, unknown>
  ): JSONSchema {
    let effectiveSchema = { ...schema };

    // Apply dependentSchemas
    if (schema.dependentSchemas) {
      for (const [propName, depSchema] of Object.entries(
        schema.dependentSchemas
      )) {
        // Only apply if the property exists in the value
        if (propName in value && value[propName] !== undefined) {
          if (typeof depSchema !== "boolean" && depSchema) {
            effectiveSchema = this._mergeSchemas(effectiveSchema, depSchema);
          }
        }
      }
    }

    return effectiveSchema;
  }

  /**
   * Render an array field
   */
  private _renderArray(
    schema: JSONSchema,
    path: string,
    value: unknown[]
  ): unknown {
    const currentValue = value || [];
    const prefixItems = schema.prefixItems || [];
    const hasPrefixItems = prefixItems.length > 0;

    // For tuple-style arrays with prefixItems, calculate add constraints
    const canAddMore = this._canAddArrayItem(schema, currentValue.length);
    const canRemoveItem = (index: number) =>
      this._canRemoveArrayItem(schema, currentValue.length, index);

    return html`
      <div class="jsf-array ${hasPrefixItems ? "jsf-array--tuple" : ""}">
        ${currentValue.map((item, index) => {
          // Determine the schema for this item
          const itemSchema = this._getArrayItemSchema(schema, index);
          const isPrefixItem = index < prefixItems.length;

          return html`
            <div
              class="jsf-array-item ${isPrefixItem
                ? "jsf-array-item--prefix"
                : ""}"
            >
              ${isPrefixItem
                ? html`<span class="jsf-array-item-index">${index + 1}</span>`
                : ""}
              <div class="jsf-array-item-content">
                ${this._renderSchema(itemSchema, `${path}/${index}`, item)}
              </div>
              <div class="jsf-array-item-actions">
                ${canRemoveItem(index)
                  ? html`
                      <button
                        type="button"
                        class="jsf-icon-button jsf-icon-button--danger"
                        title="Remove item"
                        @click=${() => this._removeArrayItem(path, index)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>
                    `
                  : ""}
              </div>
            </div>
          `;
        })}
        ${canAddMore
          ? html`
              <button
                type="button"
                class="jsf-button jsf-button--secondary jsf-array-add"
                @click=${() => this._addArrayItem(path, schema)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                Add Item
              </button>
            `
          : ""}
      </div>
    `;
  }

  /**
   * Get the schema for an array item at a specific index
   * Handles prefixItems (tuple validation) and items
   */
  private _getArrayItemSchema(
    schema: JSONSchema,
    index: number
  ): JSONSchema | boolean {
    const prefixItems = schema.prefixItems || [];

    // If within prefixItems range, use that schema
    if (index < prefixItems.length) {
      return prefixItems[index];
    }

    // For items beyond prefixItems, use 'items' schema
    // If items is not specified and we have prefixItems, additional items may not be allowed
    if (schema.items !== undefined) {
      return schema.items;
    }

    // Default: allow any item
    return {};
  }

  /**
   * Check if we can add more items to an array
   */
  private _canAddArrayItem(schema: JSONSchema, currentLength: number): boolean {
    // Check maxItems constraint
    if (schema.maxItems !== undefined && currentLength >= schema.maxItems) {
      return false;
    }

    // If items is explicitly false and we're beyond prefixItems, can't add
    const prefixLength = schema.prefixItems?.length || 0;
    if (currentLength >= prefixLength && schema.items === false) {
      return false;
    }

    return true;
  }

  /**
   * Check if we can remove an item at a specific index
   */
  private _canRemoveArrayItem(
    schema: JSONSchema,
    currentLength: number,
    index: number
  ): boolean {
    // Check minItems constraint
    if (schema.minItems !== undefined && currentLength <= schema.minItems) {
      return false;
    }

    // For prefixItems, we generally don't want to remove them
    // unless removing from the end
    const prefixLength = schema.prefixItems?.length || 0;
    if (index < prefixLength && currentLength <= prefixLength) {
      // Can only remove if we're above the required prefix length
      return false;
    }

    return true;
  }

  /**
   * Render anyOf/oneOf with a schema selector
   */
  private _renderAnyOfOneOf(
    parentSchema: JSONSchema,
    schemas: (JSONSchema | boolean)[],
    keyword: "anyOf" | "oneOf",
    path: string,
    value: unknown
  ): unknown {
    // Filter out boolean schemas and get valid schema options
    const validSchemas = schemas
      .map((s, i) => ({ schema: s, index: i }))
      .filter((s) => typeof s.schema !== "boolean" || s.schema);

    if (validSchemas.length === 0) {
      return html`<div class="jsf-error">No valid schemas in ${keyword}</div>`;
    }

    // Get the currently selected schema index, defaulting to first option or auto-detect
    let selectedIndex = this._schemaSelections.get(path);
    let shouldInitializeValue = false;
    if (selectedIndex === undefined) {
      // Try to auto-detect which schema matches the current value
      selectedIndex = this._detectMatchingSchema(validSchemas, value);
      this._schemaSelections.set(path, selectedIndex);
      // If value is undefined/null or empty object, we should initialize it
      shouldInitializeValue =
        value === undefined ||
        value === null ||
        (typeof value === "object" &&
          !Array.isArray(value) &&
          Object.keys(value as object).length === 0);
    }

    const selectedOption = validSchemas[selectedIndex] || validSchemas[0];
    const selectedSchema =
      typeof selectedOption.schema === "boolean" ? {} : selectedOption.schema;

    // Initialize value with defaults from selected schema if needed
    // This ensures required properties with const values are populated
    if (shouldInitializeValue && typeof selectedOption.schema !== "boolean") {
      const defaultValue = this._getDefaultValue(selectedOption.schema);
      // Use setTimeout to avoid updating state during render
      setTimeout(() => this._handleValueChange(path, defaultValue), 0);
      // Use the default value for rendering
      value = defaultValue;
    }

    // Get labels for options
    const optionLabels = validSchemas.map((opt, idx) => {
      if (typeof opt.schema === "boolean") {
        return `Option ${idx + 1}`;
      }
      return (
        opt.schema.title ||
        opt.schema.description?.slice(0, 30) ||
        this._getSchemaTypeLabel(opt.schema) ||
        `Option ${idx + 1}`
      );
    });

    const hasError = this._errors.some((e) => e.instancePath === path);

    return html`
      <div class="jsf-composition">
        ${parentSchema.title
          ? html`<label class="jsf-label">${parentSchema.title}</label>`
          : ""}
        <div class="jsf-composition-selector">
          <select
            class="jsf-input jsf-select ${hasError ? "jsf-input--error" : ""}"
            part="input"
            @change=${(e: Event) => {
              const newIndex = parseInt(
                (e.target as HTMLSelectElement).value,
                10
              );
              this._handleSchemaSelection(path, newIndex, validSchemas);
            }}
          >
            ${validSchemas.map(
              (opt, idx) => html`
                <option value=${idx} ?selected=${idx === selectedIndex}>
                  ${optionLabels[idx]}
                </option>
              `
            )}
          </select>
        </div>
        <div class="jsf-composition-content">
          ${this._renderSchema(selectedSchema, path, value)}
        </div>
        ${parentSchema.description
          ? html`<p class="jsf-description">${parentSchema.description}</p>`
          : ""}
      </div>
    `;
  }

  /**
   * Try to detect which schema in an anyOf/oneOf matches the current value
   */
  private _detectMatchingSchema(
    schemas: { schema: JSONSchema | boolean; index: number }[],
    value: unknown
  ): number {
    if (value === undefined || value === null) {
      return 0;
    }

    // Try each schema and return the first one that validates without errors
    for (let i = 0; i < schemas.length; i++) {
      const schema = schemas[i].schema;
      if (typeof schema === "boolean") continue;

      // Quick type check first
      const types = SchemaParser.getTypes(schema);
      const valueType = this._getValueType(value);

      if (types.length === 0 || types.includes(valueType)) {
        // If types match, do a quick validation
        if (this._validator) {
          const errors = this._validator.validate(value, schema);
          if (errors.length === 0) {
            return i;
          }
        } else {
          return i;
        }
      }
    }

    return 0;
  }

  /**
   * Get the JSON type of a value
   */
  private _getValueType(value: unknown): string {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    const type = typeof value;
    if (type === "number" && Number.isInteger(value)) return "integer";
    return type;
  }

  /**
   * Get a label describing a schema's type
   */
  private _getSchemaTypeLabel(schema: JSONSchema): string {
    const types = SchemaParser.getTypes(schema);
    if (types.length > 0) {
      return types.join(" | ");
    }
    if (schema.enum) {
      return "enum";
    }
    if (schema.const !== undefined) {
      return `const: ${JSON.stringify(schema.const)}`;
    }
    if (schema.properties) {
      return "object";
    }
    if (schema.items) {
      return "array";
    }
    return "";
  }

  /**
   * Handle schema selection change in anyOf/oneOf
   */
  private _handleSchemaSelection(
    path: string,
    newIndex: number,
    validSchemas: { schema: JSONSchema | boolean; index: number }[]
  ): void {
    this._schemaSelections.set(path, newIndex);

    // Get the new schema and generate default value
    const newSchema = validSchemas[newIndex]?.schema;
    if (newSchema && typeof newSchema !== "boolean") {
      const newValue = this._getDefaultValue(newSchema);
      this._handleValueChange(path, newValue);
    }

    this.requestUpdate();
  }

  /**
   * Render conditional schema (if/then/else)
   */
  private _renderConditional(
    schema: JSONSchema,
    path: string,
    value: unknown
  ): unknown {
    // Evaluate the 'if' condition
    const ifSchema = schema.if;
    let conditionMet = true;

    if (ifSchema !== undefined && this._validator) {
      if (typeof ifSchema === "boolean") {
        conditionMet = ifSchema;
      } else {
        const errors = this._validator.validate(value, ifSchema);
        conditionMet = errors.length === 0;
      }
    }

    // Build the effective schema by merging if/then/else result with base schema
    const baseSchema = { ...schema };
    delete baseSchema.if;
    delete baseSchema.then;
    delete baseSchema.else;

    // Determine which conditional schema to apply
    const conditionalSchema = conditionMet ? schema.then : schema.else;

    // If no conditional schema applies, just render base
    if (conditionalSchema === undefined) {
      return this._renderSchemaContent(baseSchema, path, value);
    }

    // Merge conditional schema with base schema
    const effectiveSchema =
      typeof conditionalSchema === "boolean"
        ? baseSchema
        : this._mergeSchemas(baseSchema, conditionalSchema);

    return this._renderSchemaContent(effectiveSchema, path, value);
  }

  /**
   * Merge two schemas together (simple shallow merge)
   */
  private _mergeSchemas(base: JSONSchema, overlay: JSONSchema): JSONSchema {
    const merged: JSONSchema = { ...base };

    // Merge properties
    if (overlay.properties) {
      merged.properties = { ...base.properties, ...overlay.properties };
    }

    // Merge required
    if (overlay.required) {
      merged.required = [
        ...new Set([...(base.required || []), ...overlay.required]),
      ];
    }

    // Copy over other overlay properties
    for (const key of Object.keys(overlay)) {
      if (key !== "properties" && key !== "required") {
        (merged as Record<string, unknown>)[key] = overlay[key];
      }
    }

    return merged;
  }

  /**
   * Render schema content (called after resolving refs, composition, conditions)
   */
  private _renderSchemaContent(
    schema: JSONSchema,
    path: string,
    value: unknown
  ): unknown {
    // Determine type and render appropriate field
    const types = SchemaParser.getTypes(schema);
    const primaryType = types[0] || this._inferType(schema, value);

    // Get errors for this path
    const fieldErrors = this._errors.filter((e) => e.instancePath === path);

    // Get field label (title or derived from field name)
    const fieldLabel = this._getFieldLabel(schema, path);

    return html`
      <div
        class="jsf-field ${schema.deprecated
          ? "jsf-deprecated"
          : ""} ${schema.readOnly ? "jsf-readonly" : ""}"
        part="field"
      >
        ${fieldLabel
          ? html`
              <label
                class="jsf-label ${schema.required?.length
                  ? "jsf-label-required"
                  : ""}"
                part="label"
              >
                ${fieldLabel}
              </label>
            `
          : ""}
        ${this._renderFieldByType(primaryType, schema, path, value)}
        ${schema.description
          ? html` <p class="jsf-description">${schema.description}</p> `
          : ""}
        ${fieldErrors.map(
          (error) => html`
            <div class="jsf-error" part="error" role="alert">
              <svg
                class="jsf-error-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              ${error.message}
            </div>
          `
        )}
      </div>
    `;
  }

  /**
   * Add an item to an array
   */
  private _addArrayItem(path: string, schema: JSONSchema): void {
    const currentValue =
      ((path
        ? this._getNestedValue(this.value, path)
        : this.value) as unknown[]) || [];

    // Get the schema for the new item based on its index
    const newIndex = currentValue.length;
    const itemSchema = this._getArrayItemSchema(schema, newIndex);
    const newItem =
      itemSchema && typeof itemSchema !== "boolean"
        ? this._getDefaultValue(itemSchema)
        : undefined;

    this._handleValueChange(path, [...currentValue, newItem]);
  }

  /**
   * Remove an item from an array
   */
  private _removeArrayItem(path: string, index: number): void {
    const currentValue =
      ((path
        ? this._getNestedValue(this.value, path)
        : this.value) as unknown[]) || [];
    const newValue = currentValue.filter((_, i) => i !== index);
    this._handleValueChange(path, newValue);
  }

  /**
   * Get a nested value from an object
   */
  private _getNestedValue(obj: unknown, path: string): unknown {
    const parts = path.split("/").filter((p) => p !== "");
    let current = obj;

    for (const part of parts) {
      if (current === null || current === undefined) {
        return undefined;
      }
      if (Array.isArray(current)) {
        current = current[parseInt(part, 10)];
      } else if (typeof current === "object") {
        current = (current as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }

    return current;
  }

  /**
   * Check if a field at a path is required
   */
  private _isRequired(path: string): boolean {
    // This is a simplified check - full implementation would walk up the schema tree
    const parts = path.split("/").filter((p) => p !== "");
    if (parts.length === 0) return false;

    const fieldName = parts[parts.length - 1];

    // Check if the parent schema has this field in required
    if (this._parsedSchema?.required?.includes(fieldName)) {
      return true;
    }

    return false;
  }

  /**
   * Get the label for a field - uses title if available, otherwise derives from path
   */
  private _getFieldLabel(schema: JSONSchema, path: string): string | null {
    // Use title if available
    if (schema.title) {
      return schema.title;
    }

    // Extract field name from path
    const parts = path.split("/").filter((p) => p !== "");
    if (parts.length === 0) {
      return null;
    }

    const fieldName = parts[parts.length - 1];

    // Skip numeric indices (array items)
    if (/^\d+$/.test(fieldName)) {
      return null;
    }

    // Convert field name to human-readable label
    return this._fieldNameToLabel(fieldName);
  }

  /**
   * Convert a field name to a human-readable label
   * e.g., "firstName" -> "First Name", "user_email" -> "User Email"
   */
  private _fieldNameToLabel(fieldName: string): string {
    return (
      fieldName
        // Insert space before uppercase letters (camelCase)
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        // Replace underscores and hyphens with spaces
        .replace(/[_-]/g, " ")
        // Capitalize first letter of each word
        .replace(/\b\w/g, (char) => char.toUpperCase())
        // Trim whitespace
        .trim()
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "json-schema-form": JsonSchemaForm;
  }
}
