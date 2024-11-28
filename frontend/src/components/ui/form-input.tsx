import { InputHTMLAttributes } from 'react'
import { Input } from './input'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function FormInput({ label, error, className = '', ...props }: FormInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-200">
          {label}
        </label>
      )}
      <Input
        {...props}
        className={`bg-[#141414] text-gray-200 ${error ? 'border-red-400' : ''} ${className}`}
      />
      {error && (
        <div className="text-red-400 text-xs">{error}</div>
      )}
    </div>
  )
}
