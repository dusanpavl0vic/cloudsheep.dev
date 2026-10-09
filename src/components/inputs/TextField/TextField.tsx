import { ErrorText, Hint, Input, Label, Root, Select, TextArea } from './TextField.styles'
import type { TextFieldProps } from './TextField.types'

/**
 * Polje forme sa vidljivom oznakom; greška i opis su povezani preko `aria-describedby`, a
 * `aria-invalid` prati grešku (docs/15 §4). Radi sa RHF `register` (React 19: `ref` je prop).
 */
const TextField = (props: TextFieldProps) => {
  const { id, label, error, hint, className } = props
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined
  const a11y = { id, 'aria-invalid': Boolean(error) || undefined, 'aria-describedby': describedBy, $invalid: Boolean(error) }

  const control = (() => {
    if ('options' in props) {
      const { id: _id, label: _label, error: _error, hint: _hint, className: _className, multiline: _multiline, options, ...rest } = props
      return (
        <Select {...rest} {...a11y}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      )
    }
    if (props.multiline) {
      const { id: _id, label: _label, error: _error, hint: _hint, className: _className, multiline: _multiline, ...rest } = props
      return <TextArea {...rest} {...a11y} />
    }
    const { id: _id, label: _label, error: _error, hint: _hint, className: _className, multiline: _multiline, ...rest } = props
    return <Input {...rest} {...a11y} />
  })()

  return (
    <Root className={className}>
      <Label htmlFor={id}>{label}</Label>
      {control}
      {error && (
        <ErrorText id={errorId} role="alert">
          {error}
        </ErrorText>
      )}
      {hint && <Hint id={hintId}>{hint}</Hint>}
    </Root>
  )
}

export default TextField
