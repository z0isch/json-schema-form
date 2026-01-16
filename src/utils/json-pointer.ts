/**
 * JSON Pointer implementation (RFC 6901)
 * Used for navigating and referencing within JSON documents
 */

/**
 * Encode a property name for use in a JSON Pointer
 */
export function encodePointerSegment(segment: string): string {
  return segment.replace(/~/g, "~0").replace(/\//g, "~1");
}

/**
 * Decode a JSON Pointer segment
 */
export function decodePointerSegment(segment: string): string {
  return segment.replace(/~1/g, "/").replace(/~0/g, "~");
}

/**
 * Parse a JSON Pointer string into an array of segments
 */
export function parsePointer(pointer: string): string[] {
  if (pointer === "" || pointer === "#") {
    return [];
  }

  // Remove leading # if present (for URI fragment form)
  const normalized = pointer.startsWith("#") ? pointer.slice(1) : pointer;

  if (normalized === "" || normalized === "/") {
    return [];
  }

  if (!normalized.startsWith("/")) {
    throw new Error(`Invalid JSON Pointer: ${pointer}`);
  }

  return normalized.slice(1).split("/").map(decodePointerSegment);
}

/**
 * Build a JSON Pointer string from an array of segments
 */
export function buildPointer(segments: string[]): string {
  if (segments.length === 0) {
    return "";
  }
  return "/" + segments.map(encodePointerSegment).join("/");
}

/**
 * Get a value from an object using a JSON Pointer
 */
export function getValueAtPointer(obj: unknown, pointer: string): unknown {
  const segments = parsePointer(pointer);
  let current: unknown = obj;

  for (const segment of segments) {
    if (current === null || current === undefined) {
      return undefined;
    }

    if (Array.isArray(current)) {
      const index = parseInt(segment, 10);
      if (isNaN(index) || index < 0) {
        return undefined;
      }
      current = current[index];
    } else if (typeof current === "object") {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * Set a value in an object using a JSON Pointer
 * Creates intermediate objects/arrays as needed
 */
export function setValueAtPointer(
  obj: Record<string, unknown> | unknown[],
  pointer: string,
  value: unknown
): void {
  const segments = parsePointer(pointer);

  if (segments.length === 0) {
    throw new Error("Cannot set value at root pointer");
  }

  let current: unknown = obj;

  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i];
    const nextSegment = segments[i + 1];
    const nextIsArrayIndex = /^\d+$/.test(nextSegment);

    if (Array.isArray(current)) {
      const index = parseInt(segment, 10);
      if (current[index] === undefined) {
        current[index] = nextIsArrayIndex ? [] : {};
      }
      current = current[index];
    } else if (typeof current === "object" && current !== null) {
      const record = current as Record<string, unknown>;
      if (record[segment] === undefined) {
        record[segment] = nextIsArrayIndex ? [] : {};
      }
      current = record[segment];
    } else {
      throw new Error(
        `Cannot traverse through non-object at ${buildPointer(
          segments.slice(0, i)
        )}`
      );
    }
  }

  const lastSegment = segments[segments.length - 1];

  if (Array.isArray(current)) {
    const index = parseInt(lastSegment, 10);
    current[index] = value;
  } else if (typeof current === "object" && current !== null) {
    (current as Record<string, unknown>)[lastSegment] = value;
  } else {
    throw new Error(`Cannot set property on non-object`);
  }
}

/**
 * Delete a value at a JSON Pointer location
 */
export function deleteValueAtPointer(
  obj: Record<string, unknown> | unknown[],
  pointer: string
): boolean {
  const segments = parsePointer(pointer);

  if (segments.length === 0) {
    return false;
  }

  let current: unknown = obj;

  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i];

    if (Array.isArray(current)) {
      const index = parseInt(segment, 10);
      current = current[index];
    } else if (typeof current === "object" && current !== null) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return false;
    }

    if (current === undefined) {
      return false;
    }
  }

  const lastSegment = segments[segments.length - 1];

  if (Array.isArray(current)) {
    const index = parseInt(lastSegment, 10);
    if (index >= 0 && index < current.length) {
      current.splice(index, 1);
      return true;
    }
  } else if (typeof current === "object" && current !== null) {
    if (lastSegment in (current as Record<string, unknown>)) {
      delete (current as Record<string, unknown>)[lastSegment];
      return true;
    }
  }

  return false;
}

/**
 * Append a segment to a JSON Pointer
 */
export function appendToPointer(
  pointer: string,
  segment: string | number
): string {
  const segmentStr = typeof segment === "number" ? String(segment) : segment;
  if (pointer === "" || pointer === "#") {
    return "/" + encodePointerSegment(segmentStr);
  }
  return pointer + "/" + encodePointerSegment(segmentStr);
}

/**
 * Get the parent pointer (remove last segment)
 */
export function getParentPointer(pointer: string): string {
  const segments = parsePointer(pointer);
  if (segments.length === 0) {
    return "";
  }
  return buildPointer(segments.slice(0, -1));
}

/**
 * Get the last segment of a pointer
 */
export function getLastSegment(pointer: string): string | undefined {
  const segments = parsePointer(pointer);
  return segments[segments.length - 1];
}
