import type { JSONSchema, ValidationError } from "./types.js";
import { SchemaParser } from "./parser.js";

/**
 * Schema validator for runtime validation of form values
 */
export class SchemaValidator {
  private parser: SchemaParser;

  constructor(schema: JSONSchema | string) {
    this.parser = new SchemaParser(schema);
  }

  /**
   * Validate a value against the schema
   */
  validate(value: unknown, schema?: JSONSchema): ValidationError[] {
    const targetSchema = schema || this.parser.getSchema();
    return this.validateValue(value, targetSchema, "", "#");
  }

  /**
   * Check if a value is valid against the schema
   */
  isValid(value: unknown, schema?: JSONSchema): boolean {
    return this.validate(value, schema).length === 0;
  }

  /**
   * Validate a value against a schema at a specific path
   */
  private validateValue(
    value: unknown,
    schema: JSONSchema | boolean,
    instancePath: string,
    schemaPath: string
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // Handle boolean schemas
    if (typeof schema === "boolean") {
      if (!schema) {
        errors.push({
          instancePath,
          schemaPath,
          keyword: "false schema",
          message: "Schema is false, no value is valid",
        });
      }
      return errors;
    }

    // Handle $ref
    if (schema.$ref) {
      const resolved = this.parser.resolveRef(schema.$ref);
      if (resolved) {
        errors.push(
          ...this.validateValue(
            value,
            resolved,
            instancePath,
            `${schemaPath}/$ref`
          )
        );
      }
    }

    // Type validation
    if (schema.type) {
      const typeErrors = this.validateType(
        value,
        schema,
        instancePath,
        schemaPath
      );
      errors.push(...typeErrors);
    }

    // Enum validation
    if (schema.enum !== undefined) {
      if (!schema.enum.some((e) => this.deepEqual(e, value))) {
        errors.push({
          instancePath,
          schemaPath: `${schemaPath}/enum`,
          keyword: "enum",
          message: `Value must be one of: ${JSON.stringify(schema.enum)}`,
          params: { allowedValues: schema.enum },
        });
      }
    }

    // Const validation
    if (schema.const !== undefined) {
      if (!this.deepEqual(schema.const, value)) {
        errors.push({
          instancePath,
          schemaPath: `${schemaPath}/const`,
          keyword: "const",
          message: `Value must be: ${JSON.stringify(schema.const)}`,
          params: { allowedValue: schema.const },
        });
      }
    }

    // Type-specific validation
    if (typeof value === "string") {
      errors.push(
        ...this.validateString(value, schema, instancePath, schemaPath)
      );
    } else if (typeof value === "number") {
      errors.push(
        ...this.validateNumber(value, schema, instancePath, schemaPath)
      );
    } else if (Array.isArray(value)) {
      errors.push(
        ...this.validateArray(value, schema, instancePath, schemaPath)
      );
    } else if (typeof value === "object" && value !== null) {
      errors.push(
        ...this.validateObject(
          value as Record<string, unknown>,
          schema,
          instancePath,
          schemaPath
        )
      );
    }

    // Composition keywords
    errors.push(
      ...this.validateComposition(value, schema, instancePath, schemaPath)
    );

    // Conditional keywords (if/then/else)
    errors.push(
      ...this.validateConditional(value, schema, instancePath, schemaPath)
    );

    return errors;
  }

  /**
   * Validate the type of a value
   */
  private validateType(
    value: unknown,
    schema: JSONSchema,
    instancePath: string,
    schemaPath: string
  ): ValidationError[] {
    const types = SchemaParser.getTypes(schema);
    if (types.length === 0) return [];

    const actualType = this.getValueType(value);

    // Check if actual type matches any allowed type
    const isValid = types.some((type) => {
      if (type === "integer") {
        return typeof value === "number" && Number.isInteger(value);
      }
      return type === actualType;
    });

    if (!isValid) {
      return [
        {
          instancePath,
          schemaPath: `${schemaPath}/type`,
          keyword: "type",
          message: `Expected type ${types.join(" or ")}, got ${actualType}`,
          params: { expectedTypes: types, actualType },
        },
      ];
    }

    return [];
  }

  /**
   * Get the JSON Schema type of a value
   */
  private getValueType(value: unknown): string {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value;
  }

  /**
   * Validate string-specific keywords
   */
  private validateString(
    value: string,
    schema: JSONSchema,
    instancePath: string,
    schemaPath: string
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push({
        instancePath,
        schemaPath: `${schemaPath}/minLength`,
        keyword: "minLength",
        message: `String must be at least ${schema.minLength} characters`,
        params: { minLength: schema.minLength, actualLength: value.length },
      });
    }

    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      errors.push({
        instancePath,
        schemaPath: `${schemaPath}/maxLength`,
        keyword: "maxLength",
        message: `String must be at most ${schema.maxLength} characters`,
        params: { maxLength: schema.maxLength, actualLength: value.length },
      });
    }

    if (schema.pattern !== undefined) {
      const regex = new RegExp(schema.pattern, "u");
      if (!regex.test(value)) {
        errors.push({
          instancePath,
          schemaPath: `${schemaPath}/pattern`,
          keyword: "pattern",
          message: `String must match pattern: ${schema.pattern}`,
          params: { pattern: schema.pattern },
        });
      }
    }

    // Format validation
    if (schema.format !== undefined && value !== "") {
      const formatError = this.validateFormat(value, schema.format);
      if (formatError) {
        errors.push({
          instancePath,
          schemaPath: `${schemaPath}/format`,
          keyword: "format",
          message: formatError,
          params: { format: schema.format },
        });
      }
    }

    return errors;
  }

  /**
   * Validate string format
   */
  private validateFormat(value: string, format: string): string | null {
    switch (format) {
      case "date":
        return this.validateDateFormat(value);
      case "time":
        return this.validateTimeFormat(value);
      case "date-time":
        return this.validateDateTimeFormat(value);
      case "duration":
        return this.validateDurationFormat(value);
      case "email":
        return this.validateEmailFormat(value);
      case "idn-email":
        return this.validateIdnEmailFormat(value);
      case "uri":
        return this.validateUriFormat(value, false);
      case "uri-reference":
        return this.validateUriFormat(value, true);
      case "iri":
        return this.validateIriFormat(value, false);
      case "iri-reference":
        return this.validateIriFormat(value, true);
      case "uuid":
        return this.validateUuidFormat(value);
      case "ipv4":
        return this.validateIpv4Format(value);
      case "ipv6":
        return this.validateIpv6Format(value);
      case "hostname":
        return this.validateHostnameFormat(value);
      case "idn-hostname":
        return this.validateIdnHostnameFormat(value);
      case "regex":
        return this.validateRegexFormat(value);
      case "json-pointer":
        return this.validateJsonPointerFormat(value);
      case "relative-json-pointer":
        return this.validateRelativeJsonPointerFormat(value);
      case "uri-template":
        return this.validateUriTemplateFormat(value);
      default:
        // Unknown format - treat as valid (per JSON Schema spec)
        return null;
    }
  }

  /**
   * Validate RFC 3339 full-date format (YYYY-MM-DD)
   */
  private validateDateFormat(value: string): string | null {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      return "Must be a valid date (YYYY-MM-DD)";
    }

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return "Must be a valid date";
    }

    return null;
  }

  /**
   * Validate RFC 3339 full-time format (HH:MM:SS or HH:MM:SS.sss with timezone)
   */
  private validateTimeFormat(value: string): string | null {
    // Time with optional fractional seconds and required timezone
    const timeRegex =
      /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d+)?(Z|[+-]([01]\d|2[0-3]):[0-5]\d)?$/i;
    if (!timeRegex.test(value)) {
      return "Must be a valid time (HH:MM:SS)";
    }
    return null;
  }

  /**
   * Validate RFC 3339 date-time format
   */
  private validateDateTimeFormat(value: string): string | null {
    // ISO 8601 / RFC 3339 date-time
    const dateTimeRegex =
      /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/i;
    if (!dateTimeRegex.test(value)) {
      return "Must be a valid date-time (YYYY-MM-DDTHH:MM:SS)";
    }

    // Validate the date portion
    const datePart = value.substring(0, 10);
    const dateError = this.validateDateFormat(datePart);
    if (dateError) {
      return dateError;
    }

    return null;
  }

  /**
   * Validate ISO 8601 duration format
   */
  private validateDurationFormat(value: string): string | null {
    // ISO 8601 duration: P[n]Y[n]M[n]DT[n]H[n]M[n]S
    const durationRegex =
      /^P(?:\d+Y)?(?:\d+M)?(?:\d+W)?(?:\d+D)?(?:T(?:\d+H)?(?:\d+M)?(?:\d+(?:\.\d+)?S)?)?$/;
    if (!durationRegex.test(value) || value === "P" || value === "PT") {
      return "Must be a valid ISO 8601 duration (e.g., P1Y2M3DT4H5M6S)";
    }
    return null;
  }

  /**
   * Validate email format (RFC 5321)
   */
  private validateEmailFormat(value: string): string | null {
    // Basic email validation - allows most valid emails
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(value)) {
      return "Must be a valid email address";
    }
    return null;
  }

  /**
   * Validate internationalized email format (RFC 6531)
   */
  private validateIdnEmailFormat(value: string): string | null {
    // More permissive regex for IDN emails (allows unicode)
    const idnEmailRegex = /^.+@.+\..+$/;
    if (!idnEmailRegex.test(value)) {
      return "Must be a valid email address";
    }
    return null;
  }

  /**
   * Validate URI format (RFC 3986)
   */
  private validateUriFormat(
    value: string,
    allowReference: boolean
  ): string | null {
    try {
      const url = new URL(
        value,
        allowReference ? "http://example.com" : undefined
      );
      if (!allowReference && !url.protocol) {
        return "Must be a valid URI with scheme";
      }
      return null;
    } catch {
      return allowReference
        ? "Must be a valid URI or URI reference"
        : "Must be a valid URI";
    }
  }

  /**
   * Validate IRI format (RFC 3987)
   */
  private validateIriFormat(
    value: string,
    allowReference: boolean
  ): string | null {
    // IRI is essentially URI with unicode support
    // Modern browsers handle this in URL constructor
    return this.validateUriFormat(value, allowReference);
  }

  /**
   * Validate UUID format (RFC 4122)
   */
  private validateUuidFormat(value: string): string | null {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      return "Must be a valid UUID";
    }
    return null;
  }

  /**
   * Validate IPv4 address format (RFC 2673)
   */
  private validateIpv4Format(value: string): string | null {
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = value.match(ipv4Regex);
    if (!match) {
      return "Must be a valid IPv4 address";
    }

    // Validate each octet is 0-255
    for (let i = 1; i <= 4; i++) {
      const octet = parseInt(match[i], 10);
      if (octet < 0 || octet > 255) {
        return "Must be a valid IPv4 address (each octet must be 0-255)";
      }
    }

    return null;
  }

  /**
   * Validate IPv6 address format (RFC 4291)
   */
  private validateIpv6Format(value: string): string | null {
    // Full IPv6, compressed, or IPv4-mapped
    const ipv6Regex =
      /^(?:(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(?::[0-9a-fA-F]{1,4}){1,6}|:(?:(?::[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(?::[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+|::(?:ffff(?::0{1,4})?:)?(?:(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9])\.){3}(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9])|(?:[0-9a-fA-F]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9])\.){3}(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9]))$/;

    if (!ipv6Regex.test(value)) {
      return "Must be a valid IPv6 address";
    }
    return null;
  }

  /**
   * Validate hostname format (RFC 1123)
   */
  private validateHostnameFormat(value: string): string | null {
    // Hostname: alphanumeric and hyphens, max 253 chars total, max 63 per label
    if (value.length > 253) {
      return "Hostname must be at most 253 characters";
    }

    const hostnameRegex =
      /^(?!-)[a-zA-Z0-9-]{1,63}(?<!-)(?:\.(?!-)[a-zA-Z0-9-]{1,63}(?<!-))*$/;
    if (!hostnameRegex.test(value)) {
      return "Must be a valid hostname";
    }
    return null;
  }

  /**
   * Validate internationalized hostname format (RFC 5890)
   */
  private validateIdnHostnameFormat(value: string): string | null {
    if (value.length > 253) {
      return "Hostname must be at most 253 characters";
    }

    // Allow unicode characters in hostname
    const labels = value.split(".");
    for (const label of labels) {
      if (label.length === 0 || label.length > 63) {
        return "Each label must be 1-63 characters";
      }
      if (label.startsWith("-") || label.endsWith("-")) {
        return "Labels cannot start or end with hyphen";
      }
    }

    return null;
  }

  /**
   * Validate regex format - check if value is a valid regular expression
   */
  private validateRegexFormat(value: string): string | null {
    try {
      new RegExp(value);
      return null;
    } catch {
      return "Must be a valid regular expression";
    }
  }

  /**
   * Validate JSON Pointer format (RFC 6901)
   */
  private validateJsonPointerFormat(value: string): string | null {
    if (value === "") {
      return null; // Empty string is valid (references whole document)
    }

    if (!value.startsWith("/")) {
      return "JSON Pointer must start with / or be empty";
    }

    // Check for valid escape sequences
    const segments = value.split("/").slice(1);
    for (const segment of segments) {
      // Check for invalid escape sequences (~ must be followed by 0 or 1)
      let i = 0;
      while (i < segment.length) {
        if (segment[i] === "~") {
          if (
            i + 1 >= segment.length ||
            (segment[i + 1] !== "0" && segment[i + 1] !== "1")
          ) {
            return "Invalid escape sequence in JSON Pointer (~ must be followed by 0 or 1)";
          }
          i += 2;
        } else {
          i++;
        }
      }
    }

    return null;
  }

  /**
   * Validate Relative JSON Pointer format (draft)
   */
  private validateRelativeJsonPointerFormat(value: string): string | null {
    // Format: non-negative-integer [json-pointer | "#"]
    const relativeRegex = /^\d+(#|\/.*)?$/;
    if (!relativeRegex.test(value)) {
      return "Must be a valid relative JSON Pointer";
    }

    // If there's a JSON pointer part, validate it
    const match = value.match(/^\d+(\/.*)?$/);
    if (match && match[1]) {
      return this.validateJsonPointerFormat(match[1]);
    }

    return null;
  }

  /**
   * Validate URI template format (RFC 6570)
   */
  private validateUriTemplateFormat(value: string): string | null {
    // Basic validation - check for balanced braces and valid variable names
    let braceDepth = 0;
    let inExpression = false;

    for (let i = 0; i < value.length; i++) {
      const char = value[i];
      if (char === "{") {
        if (inExpression) {
          return "Nested braces are not allowed in URI templates";
        }
        inExpression = true;
        braceDepth++;
      } else if (char === "}") {
        if (!inExpression) {
          return "Unmatched closing brace in URI template";
        }
        inExpression = false;
        braceDepth--;
      }
    }

    if (braceDepth !== 0) {
      return "Unmatched opening brace in URI template";
    }

    return null;
  }

  /**
   * Validate number-specific keywords
   */
  private validateNumber(
    value: number,
    schema: JSONSchema,
    instancePath: string,
    schemaPath: string
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (schema.minimum !== undefined && value < schema.minimum) {
      errors.push({
        instancePath,
        schemaPath: `${schemaPath}/minimum`,
        keyword: "minimum",
        message: `Value must be >= ${schema.minimum}`,
        params: { minimum: schema.minimum, actual: value },
      });
    }

    if (schema.maximum !== undefined && value > schema.maximum) {
      errors.push({
        instancePath,
        schemaPath: `${schemaPath}/maximum`,
        keyword: "maximum",
        message: `Value must be <= ${schema.maximum}`,
        params: { maximum: schema.maximum, actual: value },
      });
    }

    if (
      schema.exclusiveMinimum !== undefined &&
      value <= schema.exclusiveMinimum
    ) {
      errors.push({
        instancePath,
        schemaPath: `${schemaPath}/exclusiveMinimum`,
        keyword: "exclusiveMinimum",
        message: `Value must be > ${schema.exclusiveMinimum}`,
        params: { exclusiveMinimum: schema.exclusiveMinimum, actual: value },
      });
    }

    if (
      schema.exclusiveMaximum !== undefined &&
      value >= schema.exclusiveMaximum
    ) {
      errors.push({
        instancePath,
        schemaPath: `${schemaPath}/exclusiveMaximum`,
        keyword: "exclusiveMaximum",
        message: `Value must be < ${schema.exclusiveMaximum}`,
        params: { exclusiveMaximum: schema.exclusiveMaximum, actual: value },
      });
    }

    if (schema.multipleOf !== undefined && value % schema.multipleOf !== 0) {
      errors.push({
        instancePath,
        schemaPath: `${schemaPath}/multipleOf`,
        keyword: "multipleOf",
        message: `Value must be a multiple of ${schema.multipleOf}`,
        params: { multipleOf: schema.multipleOf, actual: value },
      });
    }

    return errors;
  }

  /**
   * Validate array-specific keywords
   */
  private validateArray(
    value: unknown[],
    schema: JSONSchema,
    instancePath: string,
    schemaPath: string
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errors.push({
        instancePath,
        schemaPath: `${schemaPath}/minItems`,
        keyword: "minItems",
        message: `Array must have at least ${schema.minItems} items`,
        params: { minItems: schema.minItems, actualItems: value.length },
      });
    }

    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      errors.push({
        instancePath,
        schemaPath: `${schemaPath}/maxItems`,
        keyword: "maxItems",
        message: `Array must have at most ${schema.maxItems} items`,
        params: { maxItems: schema.maxItems, actualItems: value.length },
      });
    }

    if (schema.uniqueItems && !this.areItemsUnique(value)) {
      errors.push({
        instancePath,
        schemaPath: `${schemaPath}/uniqueItems`,
        keyword: "uniqueItems",
        message: "Array items must be unique",
      });
    }

    // Validate prefixItems
    if (schema.prefixItems) {
      for (let i = 0; i < schema.prefixItems.length && i < value.length; i++) {
        const itemSchema = schema.prefixItems[i];
        errors.push(
          ...this.validateValue(
            value[i],
            itemSchema,
            `${instancePath}/${i}`,
            `${schemaPath}/prefixItems/${i}`
          )
        );
      }
    }

    // Validate items (applies to items after prefixItems, or all items if no prefixItems)
    if (schema.items !== undefined) {
      const startIndex = schema.prefixItems ? schema.prefixItems.length : 0;
      for (let i = startIndex; i < value.length; i++) {
        errors.push(
          ...this.validateValue(
            value[i],
            schema.items,
            `${instancePath}/${i}`,
            `${schemaPath}/items`
          )
        );
      }
    }

    return errors;
  }

  /**
   * Validate object-specific keywords
   */
  private validateObject(
    value: Record<string, unknown>,
    schema: JSONSchema,
    instancePath: string,
    schemaPath: string
  ): ValidationError[] {
    const errors: ValidationError[] = [];
    const keys = Object.keys(value);

    // Required properties
    if (schema.required) {
      for (const required of schema.required) {
        if (!(required in value)) {
          errors.push({
            instancePath,
            schemaPath: `${schemaPath}/required`,
            keyword: "required",
            message: `Missing required property: ${required}`,
            params: { missingProperty: required },
          });
        }
      }
    }

    // Property count constraints
    if (
      schema.minProperties !== undefined &&
      keys.length < schema.minProperties
    ) {
      errors.push({
        instancePath,
        schemaPath: `${schemaPath}/minProperties`,
        keyword: "minProperties",
        message: `Object must have at least ${schema.minProperties} properties`,
        params: {
          minProperties: schema.minProperties,
          actualProperties: keys.length,
        },
      });
    }

    if (
      schema.maxProperties !== undefined &&
      keys.length > schema.maxProperties
    ) {
      errors.push({
        instancePath,
        schemaPath: `${schemaPath}/maxProperties`,
        keyword: "maxProperties",
        message: `Object must have at most ${schema.maxProperties} properties`,
        params: {
          maxProperties: schema.maxProperties,
          actualProperties: keys.length,
        },
      });
    }

    // Track which properties have been validated
    const validatedProps = new Set<string>();

    // Validate properties
    if (schema.properties) {
      for (const [propName, propSchema] of Object.entries(schema.properties)) {
        if (propName in value) {
          validatedProps.add(propName);
          errors.push(
            ...this.validateValue(
              value[propName],
              propSchema,
              `${instancePath}/${propName}`,
              `${schemaPath}/properties/${propName}`
            )
          );
        }
      }
    }

    // Validate patternProperties
    if (schema.patternProperties) {
      for (const [pattern, propSchema] of Object.entries(
        schema.patternProperties
      )) {
        const regex = new RegExp(pattern, "u");
        for (const propName of keys) {
          if (regex.test(propName)) {
            validatedProps.add(propName);
            errors.push(
              ...this.validateValue(
                value[propName],
                propSchema,
                `${instancePath}/${propName}`,
                `${schemaPath}/patternProperties/${pattern}`
              )
            );
          }
        }
      }
    }

    // Validate additionalProperties
    if (schema.additionalProperties !== undefined) {
      for (const propName of keys) {
        if (!validatedProps.has(propName)) {
          if (schema.additionalProperties === false) {
            errors.push({
              instancePath: `${instancePath}/${propName}`,
              schemaPath: `${schemaPath}/additionalProperties`,
              keyword: "additionalProperties",
              message: `Additional property not allowed: ${propName}`,
              params: { additionalProperty: propName },
            });
          } else if (typeof schema.additionalProperties === "object") {
            errors.push(
              ...this.validateValue(
                value[propName],
                schema.additionalProperties,
                `${instancePath}/${propName}`,
                `${schemaPath}/additionalProperties`
              )
            );
          }
        }
      }
    }

    // Validate dependentRequired
    if (schema.dependentRequired) {
      for (const [propName, requiredProps] of Object.entries(
        schema.dependentRequired
      )) {
        // If property exists, check that dependent required properties also exist
        if (propName in value) {
          for (const reqProp of requiredProps) {
            if (!(reqProp in value)) {
              errors.push({
                instancePath,
                schemaPath: `${schemaPath}/dependentRequired`,
                keyword: "dependentRequired",
                message: `Property "${reqProp}" is required when "${propName}" is present`,
                params: {
                  property: propName,
                  missingProperty: reqProp,
                },
              });
            }
          }
        }
      }
    }

    // Validate dependentSchemas
    if (schema.dependentSchemas) {
      for (const [propName, depSchema] of Object.entries(
        schema.dependentSchemas
      )) {
        // If property exists, validate against the dependent schema
        if (propName in value && depSchema) {
          errors.push(
            ...this.validateValue(
              value,
              depSchema,
              instancePath,
              `${schemaPath}/dependentSchemas/${propName}`
            )
          );
        }
      }
    }

    return errors;
  }

  /**
   * Validate composition keywords (allOf, anyOf, oneOf, not)
   */
  private validateComposition(
    value: unknown,
    schema: JSONSchema,
    instancePath: string,
    schemaPath: string
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // allOf - must validate against all schemas
    if (schema.allOf) {
      for (let i = 0; i < schema.allOf.length; i++) {
        errors.push(
          ...this.validateValue(
            value,
            schema.allOf[i],
            instancePath,
            `${schemaPath}/allOf/${i}`
          )
        );
      }
    }

    // anyOf - must validate against at least one schema
    if (schema.anyOf) {
      const anyOfValid = schema.anyOf.some(
        (subSchema) =>
          this.validateValue(value, subSchema, instancePath, schemaPath)
            .length === 0
      );
      if (!anyOfValid) {
        errors.push({
          instancePath,
          schemaPath: `${schemaPath}/anyOf`,
          keyword: "anyOf",
          message: "Value must match at least one schema in anyOf",
        });
      }
    }

    // oneOf - must validate against exactly one schema
    if (schema.oneOf) {
      const validCount = schema.oneOf.filter(
        (subSchema) =>
          this.validateValue(value, subSchema, instancePath, schemaPath)
            .length === 0
      ).length;
      if (validCount !== 1) {
        errors.push({
          instancePath,
          schemaPath: `${schemaPath}/oneOf`,
          keyword: "oneOf",
          message: `Value must match exactly one schema in oneOf (matched ${validCount})`,
          params: { matchedSchemas: validCount },
        });
      }
    }

    // not - must NOT validate against the schema
    if (schema.not) {
      const notErrors = this.validateValue(
        value,
        schema.not,
        instancePath,
        `${schemaPath}/not`
      );
      if (notErrors.length === 0) {
        errors.push({
          instancePath,
          schemaPath: `${schemaPath}/not`,
          keyword: "not",
          message: "Value must NOT match the schema in not",
        });
      }
    }

    return errors;
  }

  /**
   * Validate conditional keywords (if/then/else)
   */
  private validateConditional(
    value: unknown,
    schema: JSONSchema,
    instancePath: string,
    schemaPath: string
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (schema.if === undefined) {
      return errors;
    }

    // Evaluate the 'if' condition
    const ifErrors = this.validateValue(
      value,
      schema.if,
      instancePath,
      `${schemaPath}/if`
    );
    const conditionMet = ifErrors.length === 0;

    // Apply 'then' if condition is met
    if (conditionMet && schema.then !== undefined) {
      errors.push(
        ...this.validateValue(
          value,
          schema.then,
          instancePath,
          `${schemaPath}/then`
        )
      );
    }

    // Apply 'else' if condition is not met
    if (!conditionMet && schema.else !== undefined) {
      errors.push(
        ...this.validateValue(
          value,
          schema.else,
          instancePath,
          `${schemaPath}/else`
        )
      );
    }

    return errors;
  }

  /**
   * Check if all array items are unique
   */
  private areItemsUnique(arr: unknown[]): boolean {
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (this.deepEqual(arr[i], arr[j])) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Deep equality check for JSON values
   */
  private deepEqual(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (a === null || b === null) return a === b;

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((item, i) => this.deepEqual(item, b[i]));
    }

    if (typeof a === "object" && typeof b === "object") {
      const aKeys = Object.keys(a as object);
      const bKeys = Object.keys(b as object);
      if (aKeys.length !== bKeys.length) return false;
      return aKeys.every((key) =>
        this.deepEqual(
          (a as Record<string, unknown>)[key],
          (b as Record<string, unknown>)[key]
        )
      );
    }

    return false;
  }
}
