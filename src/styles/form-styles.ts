import { css } from "lit";

/**
 * Shared CSS styles for the JSON Schema Form component
 * Uses CSS custom properties for easy theming
 */
export const formStyles = css`
  :host {
    /* Colors */
    --jsf-color-primary: #6366f1;
    --jsf-color-primary-hover: #4f46e5;
    --jsf-color-error: #ef4444;
    --jsf-color-error-bg: #fef2f2;
    --jsf-color-success: #22c55e;
    --jsf-color-warning: #f59e0b;
    --jsf-color-text: #1f2937;
    --jsf-color-text-muted: #6b7280;
    --jsf-color-border: #d1d5db;
    --jsf-color-border-focus: var(--jsf-color-primary);
    --jsf-color-bg: #ffffff;
    --jsf-color-bg-secondary: #f9fafb;
    --jsf-color-bg-disabled: #f3f4f6;

    /* Typography */
    --jsf-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, sans-serif;
    --jsf-font-size-base: 0.875rem;
    --jsf-font-size-sm: 0.75rem;
    --jsf-font-size-lg: 1rem;
    --jsf-font-weight-normal: 400;
    --jsf-font-weight-medium: 500;
    --jsf-font-weight-semibold: 600;
    --jsf-line-height: 1.5;

    /* Spacing */
    --jsf-spacing-xs: 0.25rem;
    --jsf-spacing-sm: 0.5rem;
    --jsf-spacing-md: 0.75rem;
    --jsf-spacing-lg: 1rem;
    --jsf-spacing-xl: 1.5rem;

    /* Border radius */
    --jsf-radius-sm: 0.25rem;
    --jsf-radius-md: 0.375rem;
    --jsf-radius-lg: 0.5rem;

    /* Shadows */
    --jsf-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --jsf-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    --jsf-shadow-focus: 0 0 0 3px rgb(99 102 241 / 0.2);

    /* Transitions */
    --jsf-transition-fast: 150ms ease;
    --jsf-transition-normal: 200ms ease;

    display: block;
    font-family: var(--jsf-font-family);
    font-size: var(--jsf-font-size-base);
    line-height: var(--jsf-line-height);
    color: var(--jsf-color-text);
  }

  /* Form container */
  .jsf-form {
    display: flex;
    flex-direction: column;
    gap: var(--jsf-spacing-lg);
  }

  /* Field wrapper */
  .jsf-field {
    display: flex;
    flex-direction: column;
    gap: var(--jsf-spacing-xs);
  }

  /* Labels */
  .jsf-label {
    display: flex;
    align-items: center;
    gap: var(--jsf-spacing-xs);
    font-weight: var(--jsf-font-weight-medium);
    color: var(--jsf-color-text);
  }

  .jsf-label-required::after {
    content: "*";
    color: var(--jsf-color-error);
    margin-left: var(--jsf-spacing-xs);
  }

  /* Description/help text */
  .jsf-description {
    font-size: var(--jsf-font-size-sm);
    color: var(--jsf-color-text-muted);
    margin-top: var(--jsf-spacing-xs);
  }

  /* Input base styles */
  .jsf-input {
    width: 100%;
    padding: var(--jsf-spacing-sm) var(--jsf-spacing-md);
    font-family: inherit;
    font-size: var(--jsf-font-size-base);
    line-height: var(--jsf-line-height);
    color: var(--jsf-color-text);
    background-color: var(--jsf-color-bg);
    border: 1px solid var(--jsf-color-border);
    border-radius: var(--jsf-radius-md);
    transition: border-color var(--jsf-transition-fast),
      box-shadow var(--jsf-transition-fast);
    box-sizing: border-box;
  }

  .jsf-input:focus {
    outline: none;
    border-color: var(--jsf-color-border-focus);
    box-shadow: var(--jsf-shadow-focus);
  }

  .jsf-input:disabled {
    background-color: var(--jsf-color-bg-disabled);
    cursor: not-allowed;
    opacity: 0.7;
  }

  .jsf-input::placeholder {
    color: var(--jsf-color-text-muted);
  }

  .jsf-input--error {
    border-color: var(--jsf-color-error);
  }

  .jsf-input--error:focus {
    box-shadow: 0 0 0 3px rgb(239 68 68 / 0.2);
  }

  /* Textarea */
  .jsf-textarea {
    min-height: 80px;
    resize: vertical;
  }

  /* Select */
  .jsf-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right var(--jsf-spacing-sm) center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
  }

  /* Checkbox & Radio */
  .jsf-checkbox-wrapper,
  .jsf-radio-wrapper {
    display: flex;
    align-items: center;
    gap: var(--jsf-spacing-sm);
  }

  .jsf-checkbox,
  .jsf-radio {
    width: 1rem;
    height: 1rem;
    accent-color: var(--jsf-color-primary);
    cursor: pointer;
  }

  .jsf-checkbox-label,
  .jsf-radio-label {
    font-weight: var(--jsf-font-weight-normal);
    cursor: pointer;
  }

  /* Error message */
  .jsf-error {
    display: flex;
    align-items: center;
    gap: var(--jsf-spacing-xs);
    font-size: var(--jsf-font-size-sm);
    color: var(--jsf-color-error);
    margin-top: var(--jsf-spacing-xs);
  }

  .jsf-error-icon {
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
  }

  /* Buttons */
  .jsf-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--jsf-spacing-sm);
    padding: var(--jsf-spacing-sm) var(--jsf-spacing-lg);
    font-family: inherit;
    font-size: var(--jsf-font-size-base);
    font-weight: var(--jsf-font-weight-medium);
    line-height: var(--jsf-line-height);
    border-radius: var(--jsf-radius-md);
    cursor: pointer;
    transition: background-color var(--jsf-transition-fast),
      border-color var(--jsf-transition-fast),
      box-shadow var(--jsf-transition-fast);
  }

  .jsf-button--primary {
    color: white;
    background-color: var(--jsf-color-primary);
    border: 1px solid var(--jsf-color-primary);
  }

  .jsf-button--primary:hover {
    background-color: var(--jsf-color-primary-hover);
    border-color: var(--jsf-color-primary-hover);
  }

  .jsf-button--primary:focus {
    outline: none;
    box-shadow: var(--jsf-shadow-focus);
  }

  .jsf-button--secondary {
    color: var(--jsf-color-text);
    background-color: var(--jsf-color-bg);
    border: 1px solid var(--jsf-color-border);
  }

  .jsf-button--secondary:hover {
    background-color: var(--jsf-color-bg-secondary);
  }

  .jsf-button--danger {
    color: white;
    background-color: var(--jsf-color-error);
    border: 1px solid var(--jsf-color-error);
  }

  .jsf-button--danger:hover {
    background-color: #dc2626;
    border-color: #dc2626;
  }

  .jsf-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Object/nested container */
  .jsf-object {
    display: flex;
    flex-direction: column;
    gap: var(--jsf-spacing-lg);
    padding: var(--jsf-spacing-lg);
    background-color: var(--jsf-color-bg-secondary);
    border: 1px solid var(--jsf-color-border);
    border-radius: var(--jsf-radius-lg);
  }

  .jsf-object--nested {
    background-color: var(--jsf-color-bg);
  }

  .jsf-object-title {
    font-size: var(--jsf-font-size-lg);
    font-weight: var(--jsf-font-weight-semibold);
    margin: 0;
    padding-bottom: var(--jsf-spacing-sm);
    border-bottom: 1px solid var(--jsf-color-border);
  }

  /* Array container */
  .jsf-array {
    display: flex;
    flex-direction: column;
    gap: var(--jsf-spacing-md);
  }

  .jsf-array--tuple {
    padding: var(--jsf-spacing-md);
    background-color: var(--jsf-color-bg-secondary);
    border: 1px solid var(--jsf-color-border);
    border-radius: var(--jsf-radius-md);
  }

  .jsf-array-item {
    display: flex;
    gap: var(--jsf-spacing-sm);
    align-items: flex-start;
  }

  .jsf-array-item--prefix {
    padding: var(--jsf-spacing-sm);
    background-color: var(--jsf-color-bg);
    border: 1px solid var(--jsf-color-border);
    border-radius: var(--jsf-radius-sm);
  }

  .jsf-array-item-index {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5rem;
    height: 1.5rem;
    font-size: var(--jsf-font-size-sm);
    font-weight: var(--jsf-font-weight-semibold);
    color: var(--jsf-color-primary);
    background-color: var(--jsf-color-bg);
    border: 1px solid var(--jsf-color-primary);
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: var(--jsf-spacing-xs);
  }

  .jsf-array-item-content {
    flex: 1;
  }

  .jsf-array-item-actions {
    display: flex;
    gap: var(--jsf-spacing-xs);
    flex-shrink: 0;
  }

  .jsf-array-add {
    margin-top: var(--jsf-spacing-sm);
  }

  /* Icon button */
  .jsf-icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    background: transparent;
    border: 1px solid var(--jsf-color-border);
    border-radius: var(--jsf-radius-md);
    cursor: pointer;
    transition: background-color var(--jsf-transition-fast);
  }

  .jsf-icon-button:hover {
    background-color: var(--jsf-color-bg-secondary);
  }

  .jsf-icon-button--danger:hover {
    background-color: var(--jsf-color-error-bg);
    border-color: var(--jsf-color-error);
    color: var(--jsf-color-error);
  }

  /* Deprecated field indicator */
  .jsf-deprecated {
    opacity: 0.6;
  }

  .jsf-deprecated .jsf-label::after {
    content: "(deprecated)";
    font-size: var(--jsf-font-size-sm);
    font-weight: var(--jsf-font-weight-normal);
    color: var(--jsf-color-warning);
    margin-left: var(--jsf-spacing-sm);
  }

  /* Read-only indicator */
  .jsf-readonly .jsf-input {
    background-color: var(--jsf-color-bg-secondary);
    cursor: default;
  }

  /* Form actions */
  .jsf-actions {
    display: flex;
    gap: var(--jsf-spacing-md);
    justify-content: flex-end;
    padding-top: var(--jsf-spacing-lg);
    border-top: 1px solid var(--jsf-color-border);
    margin-top: var(--jsf-spacing-lg);
  }

  /* Composition (anyOf/oneOf) */
  .jsf-composition {
    display: flex;
    flex-direction: column;
    gap: var(--jsf-spacing-md);
  }

  .jsf-composition-selector {
    display: flex;
    gap: var(--jsf-spacing-sm);
    align-items: center;
  }

  .jsf-composition-selector .jsf-select {
    flex: 1;
    max-width: 300px;
  }

  .jsf-composition-content {
    padding: var(--jsf-spacing-md);
    background-color: var(--jsf-color-bg-secondary);
    border: 1px solid var(--jsf-color-border);
    border-radius: var(--jsf-radius-md);
  }

  .jsf-composition-content > .jsf-field:first-child {
    margin-top: 0;
  }

  .jsf-composition-content > .jsf-field:last-child {
    margin-bottom: 0;
  }

  /* Conditional sections animation */
  .jsf-conditional {
    animation: jsf-fade-in var(--jsf-transition-normal);
  }

  /* Circular reference indicator */
  .jsf-circular-ref {
    display: flex;
    align-items: center;
    gap: var(--jsf-spacing-sm);
    padding: var(--jsf-spacing-md);
    background-color: var(--jsf-color-bg-secondary);
    border: 1px dashed var(--jsf-color-warning);
    border-radius: var(--jsf-radius-md);
    color: var(--jsf-color-warning);
    font-size: var(--jsf-font-size-sm);
  }

  .jsf-circular-ref-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  @keyframes jsf-fade-in {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Additional Properties */
  .jsf-additional-property {
    position: relative;
    padding: var(--jsf-spacing-md);
    background-color: var(--jsf-color-bg);
    border: 1px dashed var(--jsf-color-border);
    border-radius: var(--jsf-radius-md);
    animation: jsf-fade-in var(--jsf-transition-normal);
  }

  .jsf-additional-property-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--jsf-spacing-sm);
    padding-bottom: var(--jsf-spacing-xs);
    border-bottom: 1px solid var(--jsf-color-border);
  }

  .jsf-additional-property-name {
    font-size: var(--jsf-font-size-sm);
    font-weight: var(--jsf-font-weight-medium);
    color: var(--jsf-color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  .jsf-add-property {
    display: flex;
    gap: var(--jsf-spacing-sm);
    align-items: center;
    margin-top: var(--jsf-spacing-md);
    padding-top: var(--jsf-spacing-md);
    border-top: 1px dashed var(--jsf-color-border);
  }

  .jsf-add-property-input {
    flex: 1;
    max-width: 200px;
  }

  /* Pattern-matched properties */
  .jsf-pattern-property {
    border-color: var(--jsf-color-primary);
    border-style: solid;
  }

  .jsf-pattern-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.625rem;
    margin-left: var(--jsf-spacing-xs);
    cursor: help;
  }

  /* Format-specific inputs */
  .jsf-format-input {
    position: relative;
    display: flex;
    align-items: center;
  }

  .jsf-format-icon {
    position: absolute;
    right: var(--jsf-spacing-md);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--jsf-color-text-muted);
    pointer-events: none;
    z-index: 1;
  }

  .jsf-format-icon--left {
    left: var(--jsf-spacing-md);
    right: auto;
  }

  .jsf-format-icon--regex {
    position: relative;
    left: auto;
    right: auto;
    font-family: monospace;
    font-weight: var(--jsf-font-weight-semibold);
    color: var(--jsf-color-primary);
    padding: 0 var(--jsf-spacing-xs);
  }

  .jsf-input--with-icon {
    padding-left: calc(var(--jsf-spacing-md) + 1.5rem);
  }

  .jsf-input--monospace {
    font-family: "Monaco", "Menlo", "Ubuntu Mono", "Consolas", monospace;
    font-size: calc(var(--jsf-font-size-base) * 0.95);
    letter-spacing: -0.02em;
  }

  .jsf-format-action {
    position: absolute;
    right: var(--jsf-spacing-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    color: var(--jsf-color-text-muted);
    background: var(--jsf-color-bg);
    border: 1px solid var(--jsf-color-border);
    border-radius: var(--jsf-radius-sm);
    cursor: pointer;
    transition: all var(--jsf-transition-fast);
    text-decoration: none;
  }

  .jsf-format-action:hover {
    color: var(--jsf-color-primary);
    border-color: var(--jsf-color-primary);
    background: var(--jsf-color-bg-secondary);
  }

  .jsf-format-action--button {
    position: relative;
    right: auto;
    margin-left: var(--jsf-spacing-sm);
    flex-shrink: 0;
  }

  .jsf-format-hint {
    display: block;
    width: 100%;
    margin-top: var(--jsf-spacing-xs);
    font-size: var(--jsf-font-size-sm);
    color: var(--jsf-color-text-muted);
    font-family: monospace;
  }

  /* Format-specific styling */
  .jsf-format-date .jsf-input,
  .jsf-format-time .jsf-input,
  .jsf-format-datetime .jsf-input {
    padding-right: calc(var(--jsf-spacing-md) + 1.5rem);
  }

  .jsf-format-uuid .jsf-input {
    padding-right: calc(var(--jsf-spacing-sm) + 2.5rem);
  }

  .jsf-format-uri .jsf-input {
    padding-right: calc(var(--jsf-spacing-sm) + 2.5rem);
  }

  .jsf-format-regex {
    display: flex;
    align-items: center;
    background: var(--jsf-color-bg);
    border: 1px solid var(--jsf-color-border);
    border-radius: var(--jsf-radius-md);
    overflow: hidden;
  }

  .jsf-format-regex:focus-within {
    border-color: var(--jsf-color-border-focus);
    box-shadow: var(--jsf-shadow-focus);
  }

  .jsf-format-regex .jsf-input {
    border: none;
    border-radius: 0;
    padding-left: var(--jsf-spacing-xs);
    padding-right: var(--jsf-spacing-xs);
  }

  .jsf-format-regex .jsf-input:focus {
    box-shadow: none;
  }

  .jsf-format-duration {
    flex-direction: column;
    align-items: stretch;
  }

  .jsf-format-duration .jsf-input {
    width: 100%;
  }

  /* Valid format indicator */
  .jsf-format-input
    .jsf-input:not(.jsf-input--error):not(:placeholder-shown):valid {
    border-color: var(--jsf-color-success);
  }

  .jsf-format-input
    .jsf-input:not(.jsf-input--error):not(:placeholder-shown):valid:focus {
    box-shadow: 0 0 0 3px rgb(34 197 94 / 0.2);
  }

  /* Collapsible sections */
  .jsf-collapsible {
    border: 1px solid var(--jsf-color-border);
    border-radius: var(--jsf-radius-md);
    overflow: hidden;
  }

  .jsf-collapsible-header {
    display: flex;
    align-items: center;
    gap: var(--jsf-spacing-sm);
    padding: var(--jsf-spacing-md);
    background-color: var(--jsf-color-bg-secondary);
    cursor: pointer;
    user-select: none;
    transition: background-color var(--jsf-transition-fast);
  }

  .jsf-collapsible-header:hover {
    background-color: var(--jsf-color-bg-disabled);
  }

  .jsf-collapsible-icon {
    width: 1rem;
    height: 1rem;
    transition: transform var(--jsf-transition-fast);
    flex-shrink: 0;
  }

  .jsf-collapsible--expanded .jsf-collapsible-icon {
    transform: rotate(90deg);
  }

  .jsf-collapsible-title {
    flex: 1;
    font-weight: var(--jsf-font-weight-medium);
  }

  .jsf-collapsible-summary {
    font-size: var(--jsf-font-size-sm);
    color: var(--jsf-color-text-muted);
  }

  .jsf-collapsible-content {
    display: none;
    padding: var(--jsf-spacing-lg);
    border-top: 1px solid var(--jsf-color-border);
  }

  .jsf-collapsible--expanded .jsf-collapsible-content {
    display: block;
    animation: jsf-fade-in var(--jsf-transition-normal);
  }

  /* Optional field toggle */
  .jsf-optional-field {
    display: flex;
    flex-direction: column;
    gap: var(--jsf-spacing-xs);
  }

  .jsf-optional-toggle {
    display: flex;
    align-items: center;
    gap: var(--jsf-spacing-sm);
    padding: var(--jsf-spacing-sm) var(--jsf-spacing-md);
    background-color: var(--jsf-color-bg-secondary);
    border: 1px solid var(--jsf-color-border);
    border-radius: var(--jsf-radius-md);
    cursor: pointer;
    transition: background-color var(--jsf-transition-fast),
      border-color var(--jsf-transition-fast);
  }

  .jsf-optional-toggle:hover {
    background-color: var(--jsf-color-bg-disabled);
  }

  .jsf-optional-toggle--enabled {
    border-color: var(--jsf-color-primary);
    background-color: var(--jsf-color-bg);
  }

  .jsf-optional-toggle-checkbox {
    width: 1rem;
    height: 1rem;
    accent-color: var(--jsf-color-primary);
    cursor: pointer;
    flex-shrink: 0;
  }

  .jsf-optional-toggle-label {
    flex: 1;
    font-weight: var(--jsf-font-weight-medium);
    color: var(--jsf-color-text);
    cursor: pointer;
    user-select: none;
  }

  .jsf-optional-toggle-hint {
    font-size: var(--jsf-font-size-sm);
    color: var(--jsf-color-text-muted);
    font-style: italic;
  }

  .jsf-optional-field-content {
    display: none;
    padding-left: var(--jsf-spacing-lg);
    border-left: 2px solid var(--jsf-color-primary);
    margin-left: var(--jsf-spacing-sm);
    animation: jsf-fade-in var(--jsf-transition-normal);
  }

  .jsf-optional-field--enabled .jsf-optional-field-content {
    display: block;
  }

  /* When optional toggle is inside an object, adjust spacing */
  .jsf-object > .jsf-optional-field {
    margin-bottom: 0;
  }
`;
