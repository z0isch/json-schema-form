/**
 * JSON Schema type definitions based on JSON Schema Draft 2020-12
 */

/** Primitive JSON types as defined in the spec (Section 4.2.1) */
export type JSONSchemaType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "object"
  | "array"
  | "null";

/** Format values for string validation */
export type JSONSchemaFormat =
  | "date-time"
  | "date"
  | "time"
  | "duration"
  | "email"
  | "idn-email"
  | "hostname"
  | "idn-hostname"
  | "ipv4"
  | "ipv6"
  | "uri"
  | "uri-reference"
  | "iri"
  | "iri-reference"
  | "uuid"
  | "uri-template"
  | "json-pointer"
  | "relative-json-pointer"
  | "regex";

/**
 * JSON Schema object definition
 * Supports Draft 2020-12 keywords
 */
export interface JSONSchema {
  // Schema identification (Section 8)
  $schema?: string;
  $id?: string;
  $ref?: string;
  $defs?: Record<string, JSONSchema>;
  $anchor?: string;
  $dynamicRef?: string;
  $dynamicAnchor?: string;
  $vocabulary?: Record<string, boolean>;
  $comment?: string;

  // Annotations (Section 7.7)
  title?: string;
  description?: string;
  default?: unknown;
  examples?: unknown[];
  deprecated?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;

  // Type validation
  type?: JSONSchemaType | JSONSchemaType[];
  enum?: unknown[];
  const?: unknown;

  // String validation
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: JSONSchemaFormat | string;

  // Number validation
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
  multipleOf?: number;

  // Array validation (Section 10.3.1)
  items?: JSONSchema | boolean;
  prefixItems?: (JSONSchema | boolean)[];
  contains?: JSONSchema | boolean;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  minContains?: number;
  maxContains?: number;

  // Object validation (Section 10.3.2)
  properties?: Record<string, JSONSchema | boolean>;
  patternProperties?: Record<string, JSONSchema | boolean>;
  additionalProperties?: JSONSchema | boolean;
  propertyNames?: JSONSchema | boolean;
  required?: string[];
  minProperties?: number;
  maxProperties?: number;
  dependentRequired?: Record<string, string[]>;
  dependentSchemas?: Record<string, JSONSchema | boolean>;

  // Unevaluated (Section 11)
  unevaluatedItems?: JSONSchema | boolean;
  unevaluatedProperties?: JSONSchema | boolean;

  // Composition (Section 10.2.1)
  allOf?: (JSONSchema | boolean)[];
  anyOf?: (JSONSchema | boolean)[];
  oneOf?: (JSONSchema | boolean)[];
  not?: JSONSchema | boolean;

  // Conditional (Section 10.2.2)
  if?: JSONSchema | boolean;
  then?: JSONSchema | boolean;
  else?: JSONSchema | boolean;

  // Content
  contentMediaType?: string;
  contentEncoding?: string;
  contentSchema?: JSONSchema | boolean;

  // Allow additional properties for extensions
  [key: string]: unknown;
}

/**
 * Validation error structure
 */
export interface ValidationError {
  /** JSON Pointer to the instance location */
  instancePath: string;
  /** JSON Pointer to the schema keyword that failed */
  schemaPath: string;
  /** The keyword that failed validation */
  keyword: string;
  /** Human-readable error message */
  message: string;
  /** Additional parameters specific to the keyword */
  params?: Record<string, unknown>;
}

/**
 * Parsed and normalized schema with resolved references
 */
export interface ResolvedSchema extends JSONSchema {
  /** Original $ref value if this was a reference */
  _originalRef?: string;
  /** Indicates if this schema was resolved from a reference */
  _isResolved?: boolean;
  /** Indicates if this reference is circular (prevents infinite loops) */
  _isCircular?: boolean;
}

/**
 * Schema parsing options
 */
export interface SchemaParserOptions {
  /** Base URI for resolving relative references */
  baseUri?: string;
  /** External schemas that can be referenced */
  externalSchemas?: Record<string, JSONSchema>;
  /** Whether to throw on unresolved references */
  strictRefs?: boolean;
}
