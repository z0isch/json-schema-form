import type {
  JSONSchema,
  SchemaParserOptions,
  ResolvedSchema,
} from "./types.js";

/**
 * Schema parser that handles parsing JSON Schema strings and resolving references
 */
export class SchemaParser {
  private schema: JSONSchema;
  private options: SchemaParserOptions;
  private defsMap: Map<string, JSONSchema> = new Map();
  private resolutionStack: Set<string> = new Set();

  constructor(schema: JSONSchema | string, options: SchemaParserOptions = {}) {
    this.schema = typeof schema === "string" ? JSON.parse(schema) : schema;
    this.options = options;
    this.buildDefsMap();
  }

  /**
   * Parse a JSON Schema string into a schema object
   */
  static parse(schemaString: string): JSONSchema {
    try {
      const parsed = JSON.parse(schemaString);

      // Handle boolean schemas (Section 4.3.2)
      if (typeof parsed === "boolean") {
        return parsed ? {} : { not: {} };
      }

      if (typeof parsed !== "object" || parsed === null) {
        throw new Error("Schema must be an object or boolean");
      }

      return parsed as JSONSchema;
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new Error(`Invalid JSON in schema: ${e.message}`);
      }
      throw e;
    }
  }

  /**
   * Build a map of all $defs for quick reference resolution
   */
  private buildDefsMap(): void {
    if (this.schema.$defs) {
      for (const [name, def] of Object.entries(this.schema.$defs)) {
        this.defsMap.set(`#/$defs/${name}`, def as JSONSchema);
      }
    }

    // Also support legacy "definitions" keyword
    const definitions = (this.schema as Record<string, unknown>).definitions;
    if (definitions && typeof definitions === "object") {
      for (const [name, def] of Object.entries(definitions)) {
        this.defsMap.set(`#/definitions/${name}`, def as JSONSchema);
      }
    }
  }

  /**
   * Resolve a $ref to its target schema
   * Detects and prevents circular reference loops
   */
  resolveRef(ref: string): ResolvedSchema | null {
    // Check for circular reference
    if (this.resolutionStack.has(ref)) {
      // Return a marker schema indicating circular reference
      return {
        _originalRef: ref,
        _isResolved: true,
        _isCircular: true,
        title: `Circular reference: ${ref}`,
      } as ResolvedSchema;
    }

    // Add to resolution stack
    this.resolutionStack.add(ref);

    try {
      // Handle local references (starting with #)
      if (ref.startsWith("#")) {
        const resolved = this.resolveLocalRef(ref);
        if (resolved) {
          // Check if the resolved schema has nested $refs that might be circular
          const result = {
            ...resolved,
            _originalRef: ref,
            _isResolved: true,
          };

          return result;
        }
      }

      // Handle external references
      if (this.options.externalSchemas && ref in this.options.externalSchemas) {
        return {
          ...this.options.externalSchemas[ref],
          _originalRef: ref,
          _isResolved: true,
        };
      }

      if (this.options.strictRefs) {
        throw new Error(`Unable to resolve reference: ${ref}`);
      }

      return null;
    } finally {
      // Remove from resolution stack when done
      this.resolutionStack.delete(ref);
    }
  }

  /**
   * Check if a reference would create a circular dependency
   */
  isCircularRef(ref: string): boolean {
    return this.resolutionStack.has(ref);
  }

  /**
   * Reset the resolution stack (useful for starting a new resolution chain)
   */
  resetResolutionStack(): void {
    this.resolutionStack.clear();
  }

  /**
   * Resolve a local reference (JSON Pointer within the document)
   */
  private resolveLocalRef(ref: string): JSONSchema | null {
    // Check $defs map first
    if (this.defsMap.has(ref)) {
      return this.defsMap.get(ref) || null;
    }

    // Parse JSON Pointer and navigate
    if (ref === "#") {
      return this.schema;
    }

    const pointer = ref.slice(1); // Remove leading #
    return this.resolveJsonPointer(this.schema, pointer);
  }

  /**
   * Resolve a JSON Pointer path within an object
   */
  private resolveJsonPointer(obj: unknown, pointer: string): JSONSchema | null {
    if (!pointer || pointer === "/") {
      return obj as JSONSchema;
    }

    const parts = pointer.split("/").slice(1); // Remove empty first element
    let current: unknown = obj;

    for (const part of parts) {
      // Decode JSON Pointer escapes
      const decoded = part.replace(/~1/g, "/").replace(/~0/g, "~");

      if (current === null || typeof current !== "object") {
        return null;
      }

      if (Array.isArray(current)) {
        const index = parseInt(decoded, 10);
        if (isNaN(index) || index < 0 || index >= current.length) {
          return null;
        }
        current = current[index];
      } else {
        current = (current as Record<string, unknown>)[decoded];
      }

      if (current === undefined) {
        return null;
      }
    }

    return current as JSONSchema;
  }

  /**
   * Get the parsed schema
   */
  getSchema(): JSONSchema {
    return this.schema;
  }

  /**
   * Check if a schema is a boolean schema
   */
  static isBooleanSchema(schema: unknown): schema is boolean {
    return typeof schema === "boolean";
  }

  /**
   * Normalize a schema (handle boolean schemas, apply defaults)
   */
  static normalize(schema: JSONSchema | boolean): JSONSchema {
    if (typeof schema === "boolean") {
      return schema ? {} : { not: {} };
    }
    return schema;
  }

  /**
   * Get the effective type(s) from a schema
   */
  static getTypes(schema: JSONSchema): string[] {
    if (!schema.type) {
      return [];
    }
    return Array.isArray(schema.type) ? schema.type : [schema.type];
  }

  /**
   * Check if a schema allows a specific type
   */
  static allowsType(schema: JSONSchema, type: string): boolean {
    if (!schema.type) {
      return true; // No type constraint means any type is allowed
    }
    const types = this.getTypes(schema);
    return types.includes(type);
  }
}
