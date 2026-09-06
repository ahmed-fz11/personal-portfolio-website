"use client"

/**
 * A labelled form field.
 *
 * The contact form previously had zero <label> elements — every field relied
 * on a placeholder, which disappears the moment someone types and leaves
 * screen readers with nothing to announce. Inputs were also completely
 * unstyled, inheriting Chrome's dark-mode default (#3b3b3b) with Tailwind's
 * default border against a navy card.
 */
export function FormField({
  name,
  label,
  value,
  error,
  onChange,
  onBlur,
  type = "text",
  autoComplete,
  placeholder,
  optional = false,
  textarea = false,
}: {
  name: string
  label: string
  value: string
  error?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  type?: string
  autoComplete?: string
  placeholder?: string
  optional?: boolean
  textarea?: boolean
}) {
  const id = `field-${name}`
  const errorId = `${id}-error`
  const invalid = Boolean(error)

  // Labels are deliberately quieter than the values they describe.
  const controlClasses = `w-full rounded border bg-surface px-3.5 py-3 text-body text-content
    placeholder:text-content-muted/50
    transition-colors duration-200
    ${
      invalid
        ? "border-red-500/70 focus:border-red-500"
        : "border-content/15 hover:border-content/30 focus:border-brand"
    }`

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block font-mono text-eyebrow uppercase text-content-muted"
      >
        {label}
        {optional && <span className="ml-1.5 normal-case opacity-60">(optional)</span>}
      </label>

      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={5}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? errorId : undefined}
          className={`${controlClasses} resize-y`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? errorId : undefined}
          className={controlClasses}
        />
      )}

      {invalid && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
