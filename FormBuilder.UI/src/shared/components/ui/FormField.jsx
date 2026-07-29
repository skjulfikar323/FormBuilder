import { Label } from './Label.jsx'
import { Input } from './Input.jsx'
import { cn } from '@shared/lib/utils.js'

export function FormField({ label, name, error, helper, type = 'text', register, ...inputProps }) {
  return (
    <div className={cn('flex flex-col gap-1.5', inputProps.className)}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {inputProps.required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
      )}
      <Input
        id={name}
        type={type}
        error={!!error}
        {...(register ? register(name) : { name })}
        {...inputProps}
        className={undefined}
      />
      {error && <p className="text-xs text-destructive">{error.message || error}</p>}
      {helper && !error && <p className="text-xs text-muted-foreground">{helper}</p>}
    </div>
  )
}
